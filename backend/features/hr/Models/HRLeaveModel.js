import mongoose from 'mongoose';

const leaveApplicationSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  leave_type: {
    type: String,
    required: true,
    enum: ['Sick', 'Casual', 'Annual', 'Maternity'],
    trim: true
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
    trim: true,
    maxlength: 500
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
    trim: true
  },
  approved_date: {
    type: Date
  },
  rejection_reason: {
    type: String,
    trim: true
  },
  leave_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'leaveapplications'
});

// Index for efficient queries
leaveApplicationSchema.index({ employeeId: 1, appliedDate: -1 });
leaveApplicationSchema.index({ status: 1 });

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

export default LeaveApplication;