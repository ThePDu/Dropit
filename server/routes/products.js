const router  = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly, protectAdminOrSeller } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protectAdminOrSeller, async (req, res) => {
  try { 
    const body = { ...req.body };
    if (req.seller) body.storeId = req.seller._id;
    res.status(201).json(await Product.create(body)); 
  }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/store/:storeId', async (req, res) => {
  try {
    res.json(await Product.find({ storeId: req.params.storeId }).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ✅ PUT - update product (edit + stock)
router.put('/:id', protectAdminOrSeller, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.seller) query.storeId = req.seller._id;
    const p = await Product.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', protectAdminOrSeller, async (req, res) => {
  try { 
    const query = { _id: req.params.id };
    if (req.seller) query.storeId = req.seller._id;
    const p = await Product.findOneAndDelete(query); 
    if (!p) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json({ message: 'Deleted' }); 
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;