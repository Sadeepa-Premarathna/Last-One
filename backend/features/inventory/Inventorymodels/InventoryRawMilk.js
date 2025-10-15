import mongoose from 'mongoose';
const { Schema } = mongoose;

const RawMilkSchema = new Schema(
  {
    supplierName: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      maxlength: [100, 'Supplier name cannot exceed 100 characters']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      maxlength: [15, 'Contact number cannot exceed 15 characters']
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
      default: Date.now
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['Liters', 'Kilograms'],
      default: 'Liters'
    },
    fatContent: {
      type: Number,
      required: [true, 'Fat content is required'],
      min: [0, 'Fat content cannot be negative'],
      max: [100, 'Fat content cannot exceed 100%']
    },
    quality: {
      type: String,
      required: [true, 'Quality grade is required'],
      enum: ['A', 'B', 'C'],
      default: 'A'
    },
    pricePerLiter: {
      type: Number,
      required: [true, 'Price per liter is required'],
      min: [0, 'Price cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
RawMilkSchema.index({ collectionDate: -1 });
RawMilkSchema.index({ supplierName: 1 });
RawMilkSchema.index({ paymentStatus: 1 });

export default mongoose.model('RawMilk', RawMilkSchema);