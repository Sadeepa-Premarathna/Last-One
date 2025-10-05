const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String
  },
  deliveryAddress: {
    street: String,
    city: String,
    district: String,
    postalCode: String
  },
  products: [{
    productName: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  requestedDeliveryDate: {
    type: Date,
    required: true
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveredDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Online', 'Bank Transfer']
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
