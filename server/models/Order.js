const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName: { type: String, required: true },
  phone:        { type: String, required: true },
  hostelRoom:   { type: String, required: true },
  items: [{
    productId: String,
    name:      String,
    price:     Number,
    image:     String,
    category:  String,
    qty:       Number,
  }],
  subtotal:      { type: Number, required: true },
  deliveryFee:   { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD','UPI'], default: 'COD' },
  orderStatus:   {
    type: String,
    enum: ['Pending','Confirmed','Out for Delivery','Delivered','Cancelled', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'rejected'],
    default: 'Pending'
  },
  note:          { type: String, default: '' },
  // ── Uber-style dynamic assignment ──
  storeId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  assignedStore:  { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: null },
  userLocation: {
    lat:     { type: Number, default: null },
    lng:     { type: Number, default: null },
    address: { type: String, default: '' }
  },
  notifiedStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  acceptedAt:   { type: Date, default: null },
  expiresAt:    { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
