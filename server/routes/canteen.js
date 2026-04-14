const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const CanteenItem  = require('../models/CanteenItem');
const CanteenOrder = require('../models/CanteenOrder');

// Helpers
const genPickupCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// -------- Items --------
router.get('/items', async (req, res) => {
  try {
    const filter = {};
    if (req.query.available === 'true') filter.isAvailable = true;
    if (req.query.category) filter.category = req.query.category;
    const items = await CanteenItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/items', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await CanteenItem.create(req.body)); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/items/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await CanteenItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/items/:id', protect, adminOnly, async (req, res) => {
  try { await CanteenItem.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// -------- Orders --------
router.post('/orders', async (req, res) => {
  try {
    const { customerName, phone, paymentMethod = 'CASH', pickupNote = '', items = [] } = req.body;
    if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing name, phone or items' });
    }

    // Fetch authoritative prices to avoid tampering
    const ids = items.map(i => i.itemId);
    const dbItems = await CanteenItem.find({ _id: { $in: ids }, isAvailable: true });
    const mapped = items.map(i => {
      const found = dbItems.find(d => d._id.toString() === i.itemId);
      if (!found) return null;
      const qty = Number(i.qty) || 1;
      return { itemId: found._id, name: found.name, price: found.price, qty };
    }).filter(Boolean);

    if (mapped.length === 0) return res.status(400).json({ error: 'No valid items' });

    const totalAmount = mapped.reduce((a, i) => a + i.price * i.qty, 0);
    const pickupCode  = genPickupCode();

    const order = await CanteenOrder.create({
      customerName, phone, paymentMethod, pickupNote,
      items: mapped, totalAmount, pickupCode
    });

    const io = req.app.get('io');
    if (io) io.to(`canteen_${order._id}`).emit('canteen_order_update', { orderId: order._id, orderStatus: order.orderStatus });

    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/orders', protect, adminOnly, async (req, res) => {
  try { res.json(await CanteenOrder.find().sort({ createdAt: -1 }).limit(100)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders/my/:phone', async (req, res) => {
  try { res.json(await CanteenOrder.find({ phone: req.params.phone }).sort({ createdAt: -1 }).limit(10)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/orders/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await CanteenOrder.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Not found' });
    const io = req.app.get('io');
    if (io) io.to(`canteen_${order._id}`).emit('canteen_order_update', { orderId: order._id, orderStatus: order.orderStatus });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
