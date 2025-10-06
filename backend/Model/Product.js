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
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Ice Cream', 'Cream', 'Other']
  },
  image: {
   type: String,
    default: '/placeholder-product.jpg'
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['Liters', 'Kilograms', 'Pieces', 'Bottles', 'Packets']
  },
 brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      default: 'Dairy Licious'
  },
  expiryDays: {
    type: Number,
    required: [true, 'Expiry days is required'],
    min: [1, 'Expiry days must be at least 1']
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  fatContent: {
    type: Number,
    min: [0, 'Fat content cannot be negative'],
    max: [100, 'Fat content cannot exceed 100%'],
     required: false

  },
  volume: {
    type: Number,
      min: [0, 'Volume cannot be negative'],
      required: false

  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Number of reviews cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
