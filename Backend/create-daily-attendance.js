import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

console.log('🔄 Creating daily attendance records...');

try {
  await mongoose.connect(MONGODB_URI, { 
    dbName: MONGODB_DB,
    serverSelectionTimeoutMS: 10000
  });
  
  console.log('✅ MongoDB connected successfully!');
  
  // Get all active employees
  const employeeCollection = mongoose.connection.db.collection('employees');
  const employees = await employeeCollection.find({ status: 'Active' }).toArray();
  console.log(`Found ${employees.length} active employees`);
  
  // Clear existing daily attendance records (if any)
  const attendanceCollection = mongoose.connection.db.collection('dailyattendances');
  await attendanceCollection.deleteMany({});
  console.log('Cleared existing daily attendance records');
  
  // Create daily attendance records for the last 7 days including today
  const dailyRecords = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - i);
    const dateStr = recordDate.toISOString().split('T')[0];
    
    console.log(`Creating records for ${dateStr}`);
    
    for (const employee of employees) {
      // Randomly assign status for demo (80% present, 10% late, 5% absent, 5% leave)
      const rand = Math.random();
      let status, clockIn = null, clockOut = null, hoursWorked = 0;
      
      if (rand < 0.80) { // Present
        status = 'Present';
        // Random clock in between 8:00-9:00 AM
        const clockInHour = 8 + Math.random();
        const clockInMinutes = Math.floor(clockInHour * 60);
        const clockInHours = Math.floor(clockInMinutes / 60);
        const clockInMins = clockInMinutes % 60;
        clockIn = `${clockInHours.toString().padStart(2, '0')}:${clockInMins.toString().padStart(2, '0')}`;
        
        // Random clock out between 5:00-6:00 PM
        const clockOutHour = 17 + Math.random();
        const clockOutMinutes = Math.floor(clockOutHour * 60);
        const clockOutHours = Math.floor(clockOutMinutes / 60);
        const clockOutMins = clockOutMinutes % 60;
        clockOut = `${clockOutHours.toString().padStart(2, '0')}:${clockOutMins.toString().padStart(2, '0')}`;
        
        // Calculate hours worked
        const inTime = new Date(`2000-01-01T${clockIn}`);
        const outTime = new Date(`2000-01-01T${clockOut}`);
        hoursWorked = Math.round(((outTime - inTime) / (1000 * 60 * 60)) * 10) / 10;
      } else if (rand < 0.90) { // Late
        status = 'Late';
        // Clock in after 9:00 AM
        const clockInHour = 9 + Math.random() * 2; // 9-11 AM
        const clockInMinutes = Math.floor(clockInHour * 60);
        const clockInHours = Math.floor(clockInMinutes / 60);
        const clockInMins = clockInMinutes % 60;
        clockIn = `${clockInHours.toString().padStart(2, '0')}:${clockInMins.toString().padStart(2, '0')}`;
        
        // Clock out normal time
        clockOut = '17:30';
        
        const inTime = new Date(`2000-01-01T${clockIn}`);
        const outTime = new Date(`2000-01-01T${clockOut}`);
        hoursWorked = Math.round(((outTime - inTime) / (1000 * 60 * 60)) * 10) / 10;
      } else if (rand < 0.95) { // Absent
        status = 'Absent';
        hoursWorked = 0;
      } else { // Leave
        status = 'Leave';
        hoursWorked = 0;
      }
      
      const attendanceRecord = {
        employeeId: employee.employee_id,
        date: dateStr,
        clockIn,
        clockOut,
        status,
        hoursWorked,
        requiresApproval: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dailyRecords.push(attendanceRecord);
    }
  }
  
  // Insert all records
  if (dailyRecords.length > 0) {
    await attendanceCollection.insertMany(dailyRecords);
    console.log(`✅ Created ${dailyRecords.length} daily attendance records`);
    
    // Show today's records
    const todayStr = today.toISOString().split('T')[0];
    const todaysRecords = dailyRecords.filter(r => r.date === todayStr);
    console.log(`\\n📊 Today's attendance (${todayStr}):`);
    const statusCounts = {};
    todaysRecords.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
  }
  
  await mongoose.disconnect();
  console.log('✅ Daily attendance records created successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

process.exit(0);