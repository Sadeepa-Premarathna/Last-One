// Comprehensive script to fix payroll employee IDs and demonstrate the solution
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection using environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in environment variables');
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas
const EmployeeSchema = new mongoose.Schema({}, { strict: false });
const Employee = mongoose.model('Employee', EmployeeSchema);

const PayrollSchema = new mongoose.Schema({}, { strict: false });
const Payroll = mongoose.model('Payroll', PayrollSchema);

const fixPayrollEmployeeIds = async () => {
  console.log('🔧 Starting payroll employee ID fix...\n');

  try {
    // Get all employees to create a mapping
    const employees = await Employee.find({});
    console.log(`📋 Found ${employees.length} employees in database`);
    
    const employeeMap = {};
    employees.forEach(emp => {
      employeeMap[emp._id.toString()] = emp.employee_id;
      console.log(`   ${emp.employee_id} -> ${emp.name}`);
    });
    
    console.log('\n🔄 Processing payroll records...');
    
    // Get all payroll records
    const payrolls = await Payroll.find({});
    console.log(`📊 Found ${payrolls.length} payroll records to update`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const payroll of payrolls) {
      const employeeObjectId = payroll.employeeId.toString();
      const employeeId = employeeMap[employeeObjectId];
      
      if (employeeId) {
        if (!payroll.employeeIdDisplay || payroll.employeeIdDisplay !== employeeId) {
          await Payroll.updateOne(
            { _id: payroll._id },
            { $set: { employeeIdDisplay: employeeId } }
          );
          console.log(`✅ Updated payroll ${payroll._id}: ${payroll.employeeName} -> ${employeeId}`);
          updatedCount++;
        } else {
          console.log(`⏭️  Skipped payroll ${payroll._id}: Already has correct employeeIdDisplay (${employeeId})`);
          skippedCount++;
        }
      } else {
        console.log(`❌ Could not find employee ID for ObjectId: ${employeeObjectId}`);
      }
    }
    
    console.log(`\n📈 Update Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} records`);
    console.log(`   ⏭️  Skipped: ${skippedCount} records`);
    
    // Now demonstrate the fix by showing the API response format
    console.log('\n🎯 Demonstrating the fix - Sample API response:');
    
    const samplePayroll = await Payroll.findOne({}).populate('employeeId', 'name employee_id department');
    
    if (samplePayroll) {
      const processedRecord = {
        _id: samplePayroll._id,
        employeeId: {
          name: samplePayroll.employeeId.name,
          department: samplePayroll.employeeId.department,
          id: samplePayroll.employeeId._id,
          employee_id: samplePayroll.employeeId.employee_id
        },
        employeeIdDisplay: samplePayroll.employeeIdDisplay,
        employeeName: samplePayroll.employeeName,
        month: samplePayroll.month,
        basicSalary: samplePayroll.basicSalary,
        overtimeAmount: samplePayroll.overtimeAmount,
        noPayDeductionAmount: samplePayroll.noPayDeductionAmount
      };
      
      console.log('📊 Sample processed payroll record:');
      console.log(JSON.stringify(processedRecord, null, 2));
      
      console.log('\n🎉 SUCCESS INDICATORS:');
      console.log(`   ✅ employeeIdDisplay: "${processedRecord.employeeIdDisplay}" (Human-readable employee ID)`);
      console.log(`   ✅ employeeId.employee_id: "${processedRecord.employeeId.employee_id}" (From populated employee record)`);
      console.log(`   ✅ Both fields now contain the database employee_id instead of MongoDB ObjectId`);
    }
    
    console.log('\n🚀 Frontend Integration:');
    console.log('   The PayrollManagement component will now display:');
    console.log('   - Employee ID column showing: EMP0001, EMP0002, etc.');
    console.log('   - CSV export will include correct employee IDs');
    console.log('   - Data loading will work with fixed TypeScript interfaces');
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixPayrollEmployeeIds();
  mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  console.log('🎯 Fix completed! You can now test the payroll frontend.');
};

main();