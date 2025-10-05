import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  leave_id: {
    type: String,
    unique: true
  },
  employee_id: {
    type: String,
    required: true,
    match: /^EMP\d{4}$/  // Must start with EMP followed by exactly 4 digits
  },
  leave_type: {
    type: String,
    required: true,
    enum: ['Sick', 'Casual', 'Annual']
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  applied_date: {
    type: Date,
    default: Date.now
  },
  approved_by: {
    type: String,
    default: null
  },
  approved_date: {
    type: Date,
    default: null
  },
  rejection_reason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Generate unique leave ID
leaveSchema.pre('save', async function(next) {
  if (!this.leave_id) {
    // Use timestamp-based ID to avoid database count timeout
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.leave_id = `LV${String(timestamp).slice(-4)}${String(random).padStart(3, '0')}`;
  }
  next();
});

// Validate end date is after start date
leaveSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Use the existing 'leaveapplications' collection in dairy_shop database
const Leave = mongoose.model('Leave', leaveSchema, 'leaveapplications');

export default Leave;