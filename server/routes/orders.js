const router = require('express').Router();
const Order  = require('../models/Order');
const Store  = require('../models/Store');
const { protect, adminOnly, protectAdminOrSeller } = require('../middleware/auth');

// ── Haversine distance (km) ────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── POST /orders ─ Uber-style: fan-out to nearby stores ───────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { userLocation, ...orderBody } = req.body;

    // Build base order, expires in 30 seconds
    const expiresAt = new Date(Date.now() + 30_000);
    const order = await Order.create({
      ...orderBody,
      user: req.user?._id,
      userLocation: userLocation || {},
      expiresAt,
    });

    // Reward coins
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      if (user) {
        user.coins += 10;
        user.transactions.push({
          type: 'earned',
          amount: 10,
          description: `Order #${order._id.toString().slice(-6).toUpperCase()}`,
          date: new Date()
        });
        await user.save();
      }
    }

    // Find nearby stores (within 5 km) that are open
    const stores = await Store.find({ isOpen: true });
    const MAX_KM = 5;
    const nearby = [];

    for (const store of stores) {
      if (!store.lat || !store.lng) continue;
      if (!userLocation?.lat || !userLocation?.lng) {
        // No customer location → notify all open stores
        nearby.push({ store, distKm: 0 });
      } else {
        const d = haversineKm(userLocation.lat, userLocation.lng, store.lat, store.lng);
        if (d <= MAX_KM) nearby.push({ store, distKm: d });
      }
    }

    // If no stores have location set, notify ALL open stores
    if (nearby.length === 0) {
      for (const store of stores) {
        nearby.push({ store, distKm: 0 });
      }
    }

    // Emit newOrderRequest to each nearby store room
    const io = req.app.get('io');
    const storeIds = nearby.map(n => n.store._id);
    await Order.findByIdAndUpdate(order._id, { notifiedStores: storeIds });

    if (io) {
      nearby.forEach(({ store, distKm }) => {
        io.to(`store_${store._id}`).emit('newOrderRequest', {
          orderId:    order._id,
          items:      order.items,
          totalAmount: order.totalAmount,
          hostelRoom:  order.hostelRoom,
          customerName: order.customerName,
          distanceKm: distKm.toFixed(1),
          expiresAt:  expiresAt.toISOString(),
        });
      });
    }

    // Auto-expire: after 30 s if still unassigned, notify stores it's gone
    setTimeout(async () => {
      try {
        const fresh = await Order.findById(order._id);
        if (fresh && !fresh.assignedStore) {
          if (io) {
            storeIds.forEach(sid => {
              io.to(`store_${sid}`).emit('orderExpired', { orderId: order._id });
            });
            // Notify customer too
            io.to(`order_${order._id}`).emit('order_status_update', {
              orderId: order._id,
              orderStatus: 'Cancelled',
              reason: 'No stores accepted in time'
            });
          }
          await Order.findByIdAndUpdate(order._id, { orderStatus: 'Cancelled' });
        }
      } catch {}
    }, 30_000);

    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── POST /orders/:id/accept ─ Atomic accept with race-condition guard ──────
router.post('/:id/accept', protectAdminOrSeller, async (req, res) => {
  try {
    const storeId = req.seller?._id || req.body.storeId;
    if (!storeId) return res.status(400).json({ error: 'Store ID required' });

    // Atomic: only update if assignedStore is still null
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedStore: null, orderStatus: 'Pending' },
      {
        assignedStore: storeId,
        storeId:       storeId,
        orderStatus:   'accepted',
        acceptedAt:    new Date(),
      },
      { new: true }
    );

    if (!order) {
      // Could be already taken or not found
      const existing = await Order.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Order not found' });
      return res.status(409).json({ error: 'Order already accepted by another store' });
    }

    const io = req.app.get('io');
    if (io) {
      const store = await Store.findById(storeId).lean();
      const storeName = store?.name || 'A nearby store';

      // Tell ALL notified stores that the order is taken → remove from their queue
      order.notifiedStores.forEach(sid => {
        if (sid.toString() !== storeId.toString()) {
          io.to(`store_${sid}`).emit('orderTaken', { orderId: order._id });
        }
      });

      // Notify the accepting store → confirm
      io.to(`store_${storeId}`).emit('orderAcceptedConfirm', { orderId: order._id });

      // Notify the customer
      io.to(`order_${order._id}`).emit('order_status_update', {
        orderId:     order._id,
        orderStatus: 'accepted',
        storeName,
        message:     `${storeName} accepted your order! 🎉`
      });
    }

    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── POST /orders/:id/reject ─ Seller declines, order stays live for others ─
router.post('/:id/reject', protectAdminOrSeller, async (req, res) => {
  try {
    // Just emit confirmation back to seller; don't cancel the order
    const io = req.app.get('io');
    const storeId = req.seller?._id;
    if (io && storeId) {
      io.to(`store_${storeId}`).emit('orderRejectedConfirm', { orderId: req.params.id });
    }
    res.json({ message: 'Order rejected, other stores can still accept' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── GET /orders (admin) ────────────────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.find().sort({ createdAt: -1 }).populate('assignedStore', 'name')); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /orders/store/:storeId ─ Orders assigned to this store ────────────
router.get('/store/:storeId', protectAdminOrSeller, async (req, res) => {
  try {
    if (req.seller && req.seller._id.toString() !== req.params.storeId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const orders = await Order.find({
      $or: [
        { assignedStore: req.params.storeId },
        { storeId:       req.params.storeId }
      ]
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /orders/my/:phone ─────────────────────────────────────────────────
router.get('/my/:phone', async (req, res) => {
  try { res.json(await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH/PUT /orders/:id/status ─ Update order status ───────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.seller) query.assignedStore = req.seller._id;

    const order = await Order.findOneAndUpdate(
      query,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Not found or unauthorized' });

    const io = req.app.get('io');
    if (io) io.to(`order_${order._id}`).emit('order_status_update', {
      orderId:     order._id,
      orderStatus: order.orderStatus
    });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

router.patch('/:id/status', protectAdminOrSeller, updateOrderStatus);
router.put('/:id/status',   protectAdminOrSeller, updateOrderStatus);

module.exports = router;
