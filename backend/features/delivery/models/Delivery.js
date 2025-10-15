import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Driver reference is required']
  },
  // Connection to milk collections
  milkCollections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MilkCollection'
  }],
  deliveryDate: {
    type: Date,
    required: [true, 'Delivery date is required'],
    default: Date.now
  },
  deliveryType: {
    type: String,
    enum: ['Customer Delivery', 'Milk Collection', 'Both'],
    default: 'Customer Delivery'
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String
    }
  },
  products: [{
    productName: {
      type: String,
      required: true
    },
    productType: {
      type: String,
      enum: ['Fresh Milk', 'Curd', 'Yogurt', 'Cheese', 'Butter', 'Ice Cream', 'Other'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['Liters', 'Kilograms', 'Pieces', 'Packets'],
      default: 'Liters'
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Online Transfer', 'Credit'],
    default: 'Cash'
  },
  deliveryTime: {
    scheduled: Date,
    actual: Date
  },
  route: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  signature: {
    type: String // Base64 encoded signature
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
deliverySchema.pre('save', function(next) {
  if (this.products && this.products.length > 0) {
    this.totalAmount = this.products.reduce((sum, product) => {
      product.totalPrice = product.quantity * product.pricePerUnit;
      return sum + product.totalPrice;
    }, 0);
  }
  next();
});

export default mongoose.model('Delivery', deliverySchema);

