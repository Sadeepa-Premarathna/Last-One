import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LeaveApplication from './Models/HRLeaveModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

// Sample leave applications data (using real employee IDs from the database)
const sampleLeaveApplications = [
  {
    employeeId: 'EMP0001',
    leaveType: 'Sick Leave',
    fromDate: new Date('2024-01-20'),
    toDate: new Date('2024-01-22'),
    reason: 'Flu symptoms and fever',
    status: 'Pending',
    appliedDate: new Date('2024-01-18'),
    totalDays: 3
  },
  {
    employeeId: 'EMP0002',
    leaveType: 'Casual Leave',
    fromDate: new Date('2024-01-25'),
    toDate: new Date('2024-01-26'),
    reason: 'Personal family matter',
    status: 'Pending',
    appliedDate: new Date('2024-01-17'),
    totalDays: 2
  },
  {
    employeeId: 'EMP0003',
    leaveType: 'Annual Leave',
    fromDate: new Date('2024-01-15'),
    toDate: new Date('2024-01-17'),
    reason: 'Vacation with family',
    status: 'Approved',
    appliedDate: new Date('2024-01-10'),
    approvedBy: 'Alex Martinez',
    approvedDate: new Date('2024-01-12'),
    totalDays: 3
  },
  {
    employeeId: 'EMP0004',
    leaveType: 'Sick Leave',
    fromDate: new Date('2024-01-12'),
    toDate: new Date('2024-01-13'),
    reason: 'Medical appointment',
    status: 'Rejected',
    appliedDate: new Date('2024-01-11'),
    approvedBy: 'Alex Martinez',
    approvedDate: new Date('2024-01-12'),
    totalDays: 2
  },
  {
    employeeId: 'EMP0005',
    leaveType: 'Casual Leave',
    fromDate: new Date('2024-01-08'),
    toDate: new Date('2024-01-09'),
    reason: 'Wedding ceremony',
    status: 'Approved',
    appliedDate: new Date('2024-01-05'),
    approvedBy: 'Alex Martinez',
    approvedDate: new Date('2024-01-06'),
    totalDays: 2
  },
  {
    employeeId: 'EMP0001',
    leaveType: 'Annual Leave',
    fromDate: new Date('2024-02-01'),
    toDate: new Date('2024-02-03'),
    reason: 'Personal vacation',
    status: 'Approved',
    appliedDate: new Date('2024-01-25'),
    approvedBy: 'Alex Martinez',
    approvedDate: new Date('2024-01-26'),
    totalDays: 3
  }
];

async function createSampleLeaveApplications() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4
    });

    console.log(`✅ Connected to MongoDB database: ${MONGODB_DB}`);

    // Clear existing leave applications
    console.log('🗑️ Clearing existing leave applications...');
    await LeaveApplication.deleteMany({});

    // Create sample leave applications
    console.log('📄 Creating sample leave applications...');
    const createdLeaves = await LeaveApplication.insertMany(sampleLeaveApplications);

    console.log(`✅ Successfully created ${createdLeaves.length} leave applications:`);
    createdLeaves.forEach(leave => {
      console.log(`   - ${leave.employeeId}: ${leave.leaveType} (${leave.status})`);
    });

    // Verify the data
    const totalCount = await LeaveApplication.countDocuments();
    console.log(`📊 Total leave applications in database: ${totalCount}`);

    console.log('🎉 Sample data creation completed successfully!');

  } catch (error) {
    console.error('❌ Error creating sample leave applications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Database connection closed.');
  }
}

// Run the script
createSampleLeaveApplications();