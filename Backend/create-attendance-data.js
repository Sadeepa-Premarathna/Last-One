// Test script to create sample attendance and generate payroll
import Attendance from './Models/HRAttendanceModel.js';
import Employee from './Models/HREmployeeModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

async function createSampleAttendanceData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { 
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4
    });

    console.log('✅ Connected to MongoDB');

    // Get all active employees
    const employees = await Employee.find({ status: 'Active' });
    console.log(`Found ${employees.length} active employees`);

    // Create attendance records for October 2025
    const attendanceData = [
      {
        working_days: 25,
        ot_hours: 10,
        no_pay_leave_count: 1
      },
      {
        working_days: 23,
        ot_hours: 15,
        no_pay_leave_count: 2
      },
      {
        working_days: 26,
        ot_hours: 8,
        no_pay_leave_count: 0
      }
    ];

    const month = '2025-10';
    
    for (let i = 0; i < Math.min(employees.length, attendanceData.length); i++) {
      const employee = employees[i];
      const data = attendanceData[i];

      // Check if attendance already exists
      const existing = await Attendance.findOne({
        employee_id: employee._id,
        month: month
      });

      if (existing) {
        console.log(`Attendance already exists for ${employee.name} for ${month}`);
        continue;
      }

      // Create new attendance record
      const attendance = new Attendance({
        employee_id: employee._id,
        month: month,
        working_days: data.working_days,
        ot_hours: data.ot_hours,
        no_pay_leave_count: data.no_pay_leave_count
      });

      await attendance.save();
      console.log(`✅ Created attendance for ${employee.name}: ${data.working_days} days, ${data.ot_hours} OT hours, ${data.no_pay_leave_count} no-pay leaves`);
    }

    console.log('✅ Sample attendance data created successfully');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the script
createSampleAttendanceData();