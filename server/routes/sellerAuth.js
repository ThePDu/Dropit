const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Store = require('../models/Store');

router.post('/register', async (req, res) => {
  try {
    const { name, ownerName, phone, email, password } = req.body;
    const existing = await Store.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ error: 'Store with this email or phone already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Store.create({ name, ownerName, phone, email, password: hashedPassword });
    res.status(201).json({ message: 'Store created successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = await Store.findOne({ email });
    if (!store) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: store._id, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, store: { _id: store._id, name: store.name, ownerName: store.ownerName, email: store.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
