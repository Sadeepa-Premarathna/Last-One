import mongoose from 'mongoose';

const DailyAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,  // This will store the employee_id like "EMP0001", not ObjectId
    required: true,
    trim: true
  },
  date: {
    type: String,  // Format: "YYYY-MM-DD"
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  clockIn: {
    type: String,  // Format: "HH:MM"
    required: false,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  clockOut: {
    type: String,  // Format: "HH:MM"
    required: false,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  status: {
    type: String,
    required: true,
    enum: ['Present', 'Absent', 'Late', 'Leave'],
    default: 'Present'
  },
  hoursWorked: {
    type: Number,
    required: false,
    min: 0,
    max: 24
  },
  correctionReason: {
    type: String,
    required: false,
    trim: true
  },
  correctedBy: {
    type: String,
    required: false,
    trim: true
  },
  correctedAt: {
    type: Date,
    required: false
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: String,
    required: false,
    trim: true
  },
  uploadedAt: {
    type: Date,
    required: false
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

// Compound index to prevent duplicate attendance records for same employee and date
DailyAttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Index for efficient date-based queries
DailyAttendanceSchema.index({ date: 1 });

// Index for efficient employee-based queries
DailyAttendanceSchema.index({ employeeId: 1 });

// Update the updatedAt field before saving
DailyAttendanceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate hours worked if clockIn and clockOut are provided
  if (this.clockIn && this.clockOut && !this.hoursWorked) {
    const [inHour, inMinute] = this.clockIn.split(':').map(Number);
    const [outHour, outMinute] = this.clockOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMinute;
    const outMinutes = outHour * 60 + outMinute;
    
    // Handle cases where clockOut is next day (rare but possible)
    const totalMinutes = outMinutes >= inMinutes ? 
      outMinutes - inMinutes : 
      (24 * 60) - inMinutes + outMinutes;
    
    this.hoursWorked = Number((totalMinutes / 60).toFixed(2));
  }
  
  next();
});

const DailyAttendance = mongoose.model('DailyAttendance', DailyAttendanceSchema, 'dailyattendances');

export default DailyAttendance;