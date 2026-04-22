const router = require('express').Router();
const Order  = require('../models/Order');
const { protect, adminOnly, protectAdminOrSeller } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user?._id });
    
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
    
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/store/:storeId', protectAdminOrSeller, async (req, res) => {
  try {
    const query = { storeId: req.params.storeId };
    // Make sure seller can only get their own store's orders
    if (req.seller && req.seller._id.toString() !== req.params.storeId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(await Order.find(query).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my/:phone', async (req, res) => {
  try { res.json(await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

const updateOrderStatus = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.seller) query.storeId = req.seller._id;
    
    const order = await Order.findOneAndUpdate(
      query,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Not found or unauthorized' });
    // Emit real-time update to the customer tracking this order
    const io = req.app.get('io');
    if (io) io.to(`order_${order._id}`).emit('order_status_update', { orderId: order._id, orderStatus: order.orderStatus });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

router.patch('/:id/status', protectAdminOrSeller, updateOrderStatus);
router.put('/:id/status', protectAdminOrSeller, updateOrderStatus);

module.exports = router;
