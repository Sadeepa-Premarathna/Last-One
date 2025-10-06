import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: "YYYY-MM"
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  overtimeAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  noPayDeductionAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate payroll records for same employee and month
PayrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });

// Update the updatedAt field before saving
PayrollSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Payroll = mongoose.model('Payroll', PayrollSchema);

export default Payroll;