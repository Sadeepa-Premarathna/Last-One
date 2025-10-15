import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MilkCollection',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  farmerName: String,
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Check', 'Mobile Payment'],
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  transactionReference: String,
  bankDetails: {
    bankName: String,
    accountNumber: String,
    branch: String
  },
  notes: String,
  paidBy: String, // Staff who processed the payment
  receiptNumber: String
}, {
  timestamps: true
});

// Generate payment ID automatically
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentId = `PAY-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);

