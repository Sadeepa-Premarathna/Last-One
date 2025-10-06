// Quick test to verify the payroll API changes
import('child_process').then(cp => {
  console.log('Testing updated payroll API...');
  
  const testAPI = () => {
    const options = {
      hostname: 'localhost',
      port: 8003,
      path: '/api/payroll?limit=1',
      method: 'GET'
    };

    import('http').then(http => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('Response received:');
          const jsonData = JSON.parse(data);
          if (jsonData.data && jsonData.data.length > 0) {
            const record = jsonData.data[0];
            console.log('✅ employeeIdDisplay:', record.employeeIdDisplay);
            console.log('✅ employeeId structure:', record.employeeId);
            if (record.employeeIdDisplay) {
              console.log('🎉 SUCCESS: employeeIdDisplay is now included in API response!');
            } else {
              console.log('❌ employeeIdDisplay is still missing');
            }
          }
        });
      });

      req.on('error', (e) => {
        console.error('Error testing API:', e.message);
        console.log('Starting backend server...');
        cp.exec('cd Backend && node HRApp.js', (error, stdout, stderr) => {
          if (error) {
            console.error('Error starting server:', error);
            return;
          }
          console.log('Server output:', stdout);
          setTimeout(testAPI, 3000); // Wait 3 seconds then test again
        });
      });

      req.end();
    });
  };

  testAPI();
});