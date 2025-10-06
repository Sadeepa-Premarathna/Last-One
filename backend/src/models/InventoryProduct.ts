import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  manufactureDate: Date;
  expiryDays: number;
  batchNumber: string;
  supplier: string;
  image: string;
  minStockLevel: number;
  status: 'active' | 'low-stock' | 'out-of-stock' | 'expired';
  // Shop-specific fields
  brand: string;
  isOrganic: boolean;
  fatContent?: number;
  volume?: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Ice Cream', 'Cream', 'Other'],
      default: 'Other'
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['Liters', 'Kilograms', 'Pieces', 'Bottles', 'Packets'],
      default: 'Pieces'
    },
    manufactureDate: {
      type: Date,
      required: [true, 'Manufacture date is required']
    },
    expiryDays: {
      type: Number,
      required: [true, 'Expiry days is required'],
      min: [1, 'Expiry days must be at least 1'],
      default: 7
    },
    batchNumber: {
      type: String,
      required: [true, 'Batch number is required'],
      unique: true,
      trim: true
    },
    supplier: {
      type: String,
      required: false,
      trim: true,
      default: 'N/A'
    },
    image: {
      type: String,
      default: '/placeholder-product.jpg'
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 10
    },
    status: {
      type: String,
      enum: ['active', 'low-stock', 'out-of-stock', 'expired'],
      default: 'active'
    },
    // Shop-specific fields
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      default: 'Dairy Licious'
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
  },
  {
    timestamps: true
  }
);

// Update status based on stock and expiry (for save operations)
ProductSchema.pre<IProduct>('save', function(next) {
  const now = new Date();
  const expiryDate = new Date(this.manufactureDate);
  expiryDate.setDate(expiryDate.getDate() + this.expiryDays);
  
  if (expiryDate < now) {
    this.status = 'expired';
  } else if (this.stock === 0) {
    this.status = 'out-of-stock';
  } else if (this.stock <= this.minStockLevel) {
    this.status = 'low-stock';
  } else {
    this.status = 'active';
  }
  
  next();
});

// Update status based on stock and expiry (for update operations)
ProductSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  const now = new Date();
  
  // Get the update data
  if (update.$set) {
    const stock = update.$set.stock;
    const minStockLevel = update.$set.minStockLevel;
    const expiryDays = update.$set.expiryDays;
    const manufactureDate = update.$set.manufactureDate;
    
    if (expiryDays && manufactureDate) {
      const expiryDate = new Date(manufactureDate);
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      if (expiryDate < now) {
        update.$set.status = 'expired';
      }
    }
    
    if (stock !== undefined && stock === 0) {
      update.$set.status = 'out-of-stock';
    } else if (stock !== undefined && minStockLevel !== undefined && stock <= minStockLevel) {
      update.$set.status = 'low-stock';
    } else if (stock !== undefined && stock > 0) {
      update.$set.status = 'active';
    }
  } else {
    // Handle direct updates without $set
    const stock = update.stock;
    const minStockLevel = update.minStockLevel;
    const expiryDays = update.expiryDays;
    const manufactureDate = update.manufactureDate;
    
    if (expiryDays && manufactureDate) {
      const expiryDate = new Date(manufactureDate);
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      if (expiryDate < now) {
        update.status = 'expired';
      }
    }
    
    if (stock !== undefined && stock === 0) {
      update.status = 'out-of-stock';
    } else if (stock !== undefined && minStockLevel !== undefined && stock <= minStockLevel) {
      update.status = 'low-stock';
    } else if (stock !== undefined && stock > 0) {
      update.status = 'active';
    }
  }
  
  next();
});

// Indexes for search optimization
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ batchNumber: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
