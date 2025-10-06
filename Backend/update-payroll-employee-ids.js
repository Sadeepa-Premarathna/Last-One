import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Payroll from './Models/HRPayrollModel.js';
import Employee from './Models/HREmployeeModel.js';

dotenv.config();

const updatePayrollEmployeeIds = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all payroll records that don't have employeeIdDisplay
    const payrollsToUpdate = await Payroll.find({ 
      $or: [
        { employeeIdDisplay: { $exists: false } },
        { employeeIdDisplay: null },
        { employeeIdDisplay: '' }
      ]
    }).populate('employeeId');

    console.log(`📋 Found ${payrollsToUpdate.length} payroll records to update`);

    let updatedCount = 0;
    for (const payroll of payrollsToUpdate) {
      if (payroll.employeeId && payroll.employeeId.employee_id) {
        payroll.employeeIdDisplay = payroll.employeeId.employee_id;
        await payroll.save();
        updatedCount++;
        console.log(`✅ Updated payroll for ${payroll.employeeName} - Employee ID: ${payroll.employeeId.employee_id}`);
      } else {
        console.log(`❌ Could not update payroll for ${payroll.employeeName} - No employee_id found`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} payroll records`);

    // Test the API response format
    console.log('\n🧪 Testing API response format...');
    const testPayroll = await Payroll.findOne().populate('employeeId', 'name employee_id department');
    if (testPayroll) {
      console.log('Sample payroll record:');
      console.log('- Employee Name:', testPayroll.employeeName);
      console.log('- Employee ID Display:', testPayroll.employeeIdDisplay);
      console.log('- Populated Employee ID:', testPayroll.employeeId.employee_id);
      console.log('- Department:', testPayroll.employeeId.department);
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error updating payroll records:', error);
    await mongoose.connection.close();
  }
};

updatePayrollEmployeeIds();