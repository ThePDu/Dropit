const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  mrp:         { type: Number, default: 0 },
  category:    { type: String, required: true },
  description: { type: String, default: '' },
  stock:       { type: Number, default: 100 },
  badge:       { type: String, default: '' },
  image:       { type: String, default: '' },
  images:      { type: [String], default: [] },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);