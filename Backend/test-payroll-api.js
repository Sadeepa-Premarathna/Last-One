// Simple test script for payroll generation
import axios from 'axios';

async function testPayrollGeneration() {
  try {
    console.log('Testing payroll generation for 2025-10...');
    
    const response = await axios.post('http://localhost:8003/api/payroll/generate/batch', {
      month: '2025-10'
    });

    console.log('✅ Payroll generation successful!');
    console.log('Summary:', response.data.summary);
    console.log('Generated:', response.data.data.generated.length, 'records');
    console.log('Skipped:', response.data.data.skipped.length, 'records');
    console.log('Errors:', response.data.data.errors.length, 'records');

    // Now fetch the generated payroll records
    const payrollResponse = await axios.get('http://localhost:8003/api/payroll?month=2025-10');
    console.log('\n📄 Payroll records for 2025-10:');
    payrollResponse.data.data.forEach(record => {
      const netPayable = record.basicSalary + record.overtimeAmount - record.noPayDeductionAmount;
      console.log(`${record.employeeName}: Basic=${record.basicSalary}, OT=${record.overtimeAmount}, Deduction=${record.noPayDeductionAmount}, Net=${netPayable}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testPayrollGeneration();