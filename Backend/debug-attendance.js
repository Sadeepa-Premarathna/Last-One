import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

console.log('🔄 Debugging attendance records...');

try {
  await mongoose.connect(MONGODB_URI, { 
    dbName: MONGODB_DB,
    serverSelectionTimeoutMS: 10000
  });
  
  console.log('✅ MongoDB connected successfully!');
  
  // Check attendance records
  const attendanceCollection = mongoose.connection.db.collection('attendances');
  const attendances = await attendanceCollection.find({}).limit(3).toArray();
  console.log(`📊 Attendance count: ${await attendanceCollection.countDocuments()}`);
  
  if (attendances.length > 0) {
    console.log('📄 Sample attendance records:');
    attendances.forEach((att, i) => {
      console.log(`  Record ${i + 1}:`);
      console.log(`    Full record:`, JSON.stringify(att, null, 4));
    });
  }
  
  // Check employees
  const employeeCollection = mongoose.connection.db.collection('employees');
  const employees = await employeeCollection.find({}).limit(3).toArray();
  console.log(`\n👥 Employee IDs:`);
  employees.forEach(emp => {
    console.log(`    ${emp.employee_id} - ${emp.name}`);
  });
  
  await mongoose.disconnect();
  console.log('✅ Debug completed successfully!');
  
} catch (error) {
  console.error('❌ Debug failed:', error.message);
}

process.exit(0);