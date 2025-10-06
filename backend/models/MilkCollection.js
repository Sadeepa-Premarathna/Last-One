const mongoose = require('mongoose');

const milkCollectionSchema = new mongoose.Schema({
  collectionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: [true, 'Farmer reference is required']
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Driver reference is required']
  },
  collectionDate: {
    type: Date,
    required: [true, 'Collection date is required'],
    default: Date.now
  },
  collectionTime: {
    type: String,
    enum: ['Morning', 'Evening'],
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Milk quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    enum: ['Liters', 'Gallons'],
    default: 'Liters'
  },
  quality: {
    fatContent: {
      type: Number,
      min: 0,
      max: 100
    },
    snf: {
      type: Number, // Solid Not Fat
      min: 0,
      max: 100
    },
    temperature: Number,
    smell: {
      type: String,
      enum: ['Normal', 'Abnormal']
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'Rejected'],
      default: 'A'
    }
  },
  pricePerLiter: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Collected', 'In Transit', 'Delivered', 'Rejected'],
    default: 'Collected'
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
milkCollectionSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.pricePerLiter;
  next();
});

module.exports = mongoose.model('MilkCollection', milkCollectionSchema);
