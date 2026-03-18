const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  mrp:         { type: Number, required: true },
  category:    { type: String, required: true, enum: ['snacks','drinks','instant','dairy','stationery','medicines','hygiene','frozen'] },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  stock:       { type: Number, default: 100 },
  badge:       { type: String, enum: ['','hot','new','deal','bestseller'], default: '' },
  brand:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
