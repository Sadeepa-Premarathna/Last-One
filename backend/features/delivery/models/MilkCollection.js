import mongoose from 'mongoose';

const milkCollectionSchema = new mongoose.Schema({
  collectionId: {
    type: String,
    required: [true, 'Collection ID is required'],
    unique: true,
    trim: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: [true, 'Farmer is required']
  },
  farmerId: {
    type: String,
    required: [true, 'Farmer ID is required'],
    trim: true
  },
  farmerName: {
    type: String,
    trim: true
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
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C', 'Rejected'],
    default: 'A'
  },
  collectionShift: {
    type: String,
    enum: ['Morning', 'Evening'],
    default: 'Morning'
  },
  unit: {
    type: String,
    enum: ['Liters', 'Gallons'],
    default: 'Liters'
  },
  fat_content: {
    type: Number,
    min: 0,
    max: 10
  },
  snf: {
    type: Number,
    min: 0,
    max: 15
  },
  protein_content: {
    type: Number,
    min: 0,
    max: 10
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required']
  },
  ph_level: {
    type: Number,
    min: 0,
    max: 14
  },
  smell: {
    type: String,
    enum: ['Normal', 'Abnormal'],
    default: 'Normal'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  driverId: {
    type: String,
    trim: true
  },
  driverName: {
    type: String,
    trim: true
  },
  // Connection to delivery
  assignedDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  collectionRoute: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Transit', 'Collected', 'Processing', 'Completed'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  paymentAmount: {
    type: Number,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial'],
    default: 'Pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
milkCollectionSchema.index({ farmerId: 1, collectionDate: -1 });
milkCollectionSchema.index({ driverId: 1, collectionDate: -1 });
milkCollectionSchema.index({ status: 1 });

// Virtual for formatted date
milkCollectionSchema.virtual('formattedDate').get(function() {
  return this.collectionDate.toDateString();
});

// Virtual for total value calculation
milkCollectionSchema.virtual('totalValue').get(function() {
  if (!this.paymentAmount) return 0;
  return this.quantity * this.paymentAmount;
});

// Helper to compute grade if not explicitly provided (simple heuristic)
function deriveGrade(fat, protein, snf) {
  if (fat == null || protein == null) return 'C';
  const s = snf == null ? 0 : snf;
  if (fat >= 6 && protein >= 3.5 && s >= 9) return 'A';
  if (fat >= 5 && protein >= 3.2 && s >= 8.5) return 'B';
  if (fat >= 4 && protein >= 3.0 && s >= 8.0) return 'C';
  return 'Rejected';
}

// Auto-generate collectionId & grade
milkCollectionSchema.pre('save', async function(next) {
  // Generate collectionId if missing
  if (!this.collectionId) {
    const count = await mongoose.model('MilkCollection').countDocuments();
    this.collectionId = `COL-${String(count + 1).padStart(5, '0')}`;
  }
  // Derive quality grade if not provided or empty
  if (!this.qualityGrade) {
    this.qualityGrade = deriveGrade(this.fat_content, this.protein_content, this.snf);
  }
  next();
});

export default mongoose.model('DeliveryMilkCollection', milkCollectionSchema, 'delivery_milk_collections');
