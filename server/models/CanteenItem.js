const mongoose = require('mongoose');

const canteenItemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  prepTime:    { type: Number, default: 10 }, // minutes
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CanteenItem', canteenItemSchema);
