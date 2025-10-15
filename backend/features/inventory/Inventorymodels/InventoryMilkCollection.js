import mongoose from 'mongoose';
const { Schema } = mongoose;

const MilkCollectionSchema = new Schema(
  {
    collectionId: {
      type: String,
      required: [true, 'Collection ID is required'],
      unique: true,
      trim: true
    },
    farmerName: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true,
      maxlength: [100, 'Farmer name cannot exceed 100 characters']
    },
    farmerId: {
      type: String,
      required: [true, 'Farmer ID is required'],
      trim: true
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
      default: Date.now
    },
    collectionTime: {
      type: String,
      required: [true, 'Collection time is required'],
      enum: ['Morning', 'Evening']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    fatPercentage: {
      type: Number,
      required: [true, 'Fat percentage is required'],
      min: [0, 'Fat percentage cannot be negative'],
      max: [100, 'Fat percentage cannot exceed 100%']
    },
    snfPercentage: {
      type: Number,
      required: [true, 'SNF percentage is required'],
      min: [0, 'SNF percentage cannot be negative'],
      max: [100, 'SNF percentage cannot exceed 100%']
    },
    lactometerReading: {
      type: Number,
      required: [true, 'Lactometer reading is required'],
      min: [0, 'Lactometer reading cannot be negative']
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required']
    },
    density: {
      type: Number,
      required: [true, 'Density is required'],
      min: [0, 'Density cannot be negative']
    },
    rate: {
      type: Number,
      required: [true, 'Rate per liter is required'],
      min: [0, 'Rate cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial'],
      default: 'pending'
    },
    qualityGrade: {
      type: String,
      enum: ['Premium', 'Standard', 'Below Standard'],
      default: 'Standard'
    },
    collectionCenter: {
      type: String,
      required: [true, 'Collection center is required'],
      trim: true
    },
    vehicleNumber: {
      type: String,
      trim: true
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    collection: 'milkcollection' // Explicitly set collection name
  }
);

// Indexes for faster queries
MilkCollectionSchema.index({ collectionDate: -1 });
MilkCollectionSchema.index({ farmerName: 1 });
MilkCollectionSchema.index({ farmerId: 1 });
MilkCollectionSchema.index({ collectionId: 1 });
MilkCollectionSchema.index({ paymentStatus: 1 });

export default mongoose.model('MilkCollection', MilkCollectionSchema, 'milkcollection');