const router = require('express').Router();
const Cart   = require('../models/Cart');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart || { items: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, name, price, image, category, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
    const exists = cart.items.find(i => i.productId.toString() === productId);
    if (exists) exists.quantity += quantity || 1;
    else cart.items.push({ productId, name, price, image, category, quantity: quantity || 1 });
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/remove', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(i => i.productId.toString() !== req.body.productId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
