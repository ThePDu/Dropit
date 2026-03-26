const router = require('express').Router();
const Order  = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

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

router.get('/my/:phone', async (req, res) => {
  try { res.json(await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    // Emit real-time update to the customer tracking this order
    const io = req.app.get('io');
    if (io) io.to(`order_${order._id}`).emit('order_status_update', { orderId: order._id, orderStatus: order.orderStatus });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
