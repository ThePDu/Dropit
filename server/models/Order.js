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
  orderStatus:   { type: String, enum: ['Pending','Confirmed','Out for Delivery','Delivered','Cancelled'], default: 'Pending' },
  note:          { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
