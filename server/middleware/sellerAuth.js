const jwt = require('jsonwebtoken');
const Store = require('../models/Store');

const sellerProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'seller') {
        return res.status(403).json({ error: 'Not authorized as seller' });
      }
      req.seller = await Store.findById(decoded.id).select('-password');
      if (!req.seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token failed' });
    }
  }
  res.status(401).json({ error: 'No token' });
};

module.exports = { sellerProtect };
