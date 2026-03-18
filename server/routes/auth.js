const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already exists' });
    const user = await User.create({ name, email, password, address });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
