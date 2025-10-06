// Simple test to check if the API is working
console.log('🧪 Testing HR Management API...');

fetch('http://localhost:8003/api/employees')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(employees => {
    console.log(`✅ Success! Found ${employees.length} employees:`);
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.name} (${emp.employee_id}) - ${emp.role} in ${emp.department}`);
    });
    
    // Check if your new employees are there
    const yourEmployees = employees.filter(emp => 
      emp.name.includes('David Thompson') || 
      emp.name.includes('Test Employee') || 
      emp.name.includes('James Wilson')
    );
    
    console.log(`\n🎉 Your added employees: ${yourEmployees.length}`);
    yourEmployees.forEach(emp => {
      console.log(`   - ${emp.name} (${emp.employee_id})`);
    });
  })
  .catch(error => {
    console.error('❌ API Test Failed:', error.message);
  });