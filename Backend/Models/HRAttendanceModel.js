import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: "YYYY-MM"
  },
  working_days: {
    type: Number,
    required: true,
    min: 0,
    max: 31
  },
  ot_hours: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  no_pay_leave_count: {
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

// Compound index to prevent duplicate attendance records for same employee and month
AttendanceSchema.index({ employee_id: 1, month: 1 }, { unique: true });

// Update the updatedAt field before saving
AttendanceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

export default Attendance;