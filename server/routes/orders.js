const router = require('express').Router();
const Order  = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
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
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
