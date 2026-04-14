const mongoose = require('mongoose');

const canteenOrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone:        { type: String, required: true, trim: true },
  pickupNote:   { type: String, default: '' },
  paymentMethod:{ type: String, enum: ['CASH', 'UPI'], default: 'CASH' },
  orderStatus:  { 
    type: String, 
    enum: ['Pending','In Kitchen','Ready for Pickup','Completed','Cancelled'], 
    default: 'Pending' 
  },
  pickupCode:   { type: String, required: true },
  totalAmount:  { type: Number, required: true },
  items: [{
    itemId:   { type: mongoose.Schema.Types.ObjectId, ref: 'CanteenItem' },
    name:     String,
    price:    Number,
    qty:      Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('CanteenOrder', canteenOrderSchema);
