const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['milk', 'yogurt', 'cheese', 'butter', 'cream', 'ice-cream', 'other'],
    default: 'milk'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['ml', 'l', 'g', 'kg', 'piece'],
    default: 'ml'
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock cannot be negative']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  manufacturingDate: {
    type: Date,
    required: [true, 'Manufacturing date is required']
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required'],
    unique: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbohydrates: Number,
    calcium: Number,
    vitamins: [String]
  },
  images: [{
    type: String, // URL to image
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  supplier: {
    name: String,
    contact: String,
    address: String
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient searching
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ expiryDate: 1 });

// Virtual for checking if product is expired
productSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for checking low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStock;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);