const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get user coins and transactions
// @route   GET /api/coins
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('coins transactions');
    res.json({
      balance: user.coins,
      transactions: user.transactions.sort((a, b) => b.date - a.date)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Add coins to user (internal or for specific actions)
// @route   POST /api/coins/add
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findById(req.user._id);

    user.coins += amount;
    user.transactions.push({
      type: 'earned',
      amount,
      description,
      date: new Date()
    });

    await user.save();
    res.json({ balance: user.coins, transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Redeem coins
// @route   POST /api/coins/redeem
// @access  Private
router.post('/redeem', protect, async (req, res) => {
  try {
    const { amount, reward } = req.body;
    const user = await User.findById(req.user._id);

    if (user.coins < amount) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    user.coins -= amount;
    user.transactions.push({
      type: 'spent',
      amount,
      description: `Redeemed ${reward}`,
      date: new Date()
    });

    await user.save();
    res.json({ balance: user.coins, transactions: user.transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
