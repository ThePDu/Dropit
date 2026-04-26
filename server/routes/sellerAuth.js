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

router.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find().lean();
    const Product = require('../models/Product');
    const products = await Product.find({ isActive: true }).lean();
    
    // Attach products to their respective stores
    const storesWithProducts = stores.map(store => {
      return {
        id: store._id,
        name: store.name,
        area: store.ownerName || 'Local Area',
        phone: store.phone,
        email: store.email,
        isOpen: true,
        distance: 'Nearby',
        tags: ['Fast Delivery'],
        featured: true,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
        products: products.filter(p => p.storeId?.toString() === store._id.toString()).map(p => ({
          ...p,
          id: p._id,
          inStock: p.stock > 0
        }))
      };
    });
    
    res.json(storesWithProducts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /seller/location ─ Update store GPS coords ──────────────────────
router.patch('/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    // Identify seller from JWT
    const jwt = require('jsonwebtoken');
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'Not authorized' });

    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    const store = await Store.findByIdAndUpdate(
      decoded.id,
      { lat: parseFloat(lat), lng: parseFloat(lng) },
      { new: true }
    );
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json({ message: 'Location updated', lat: store.lat, lng: store.lng });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

