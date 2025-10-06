import http from 'http';

const testPayrollAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 8003,
    path: '/api/payroll?limit=1',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ API Response received successfully');
        console.log('📊 Sample payroll record:');
        
        if (jsonData.success && jsonData.data && jsonData.data.length > 0) {
          const record = jsonData.data[0];
          console.log('- Employee Name:', record.employeeName);
          console.log('- Employee ID Display:', record.employeeIdDisplay);
          console.log('- Employee ID Object:', record.employeeId);
          console.log('- Month:', record.month);
          console.log('- Basic Salary:', record.basicSalary);
          
          if (record.employeeIdDisplay && record.employeeIdDisplay.startsWith('EMP')) {
            console.log('🎉 SUCCESS: Employee ID Display is working correctly!');
          } else {
            console.log('❌ Employee ID Display is missing or incorrect');
          }
        } else {
          console.log('❌ No payroll data found in response');
        }
      } catch (error) {
        console.error('❌ Error parsing JSON response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error connecting to API:', error.message);
    console.log('ℹ️  Make sure the backend server is running on port 8003');
  });

  req.setTimeout(5000, () => {
    console.error('❌ Request timeout - server might not be running');
    req.destroy();
  });

  req.end();
};

console.log('🧪 Testing Payroll API with updated Employee IDs...');
console.log('📡 Sending request to http://localhost:8003/api/payroll?limit=1');
testPayrollAPI();