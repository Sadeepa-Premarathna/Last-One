// Test script to verify that the Employee API returns the correct data
// Using built-in fetch available in Node.js 18+

async function testEmployeeAPI() {
    try {
        console.log('🧪 Testing Employee API...');
        
        const response = await fetch('http://localhost:8003/api/employees');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const employees = await response.json();
        
        console.log(`✅ API Response: ${employees.length} employees found`);
        
        employees.forEach((employee, index) => {
            console.log(`📋 Employee ${index + 1}:`);
            console.log(`   ID: ${employee.id}`);
            console.log(`   Employee ID: ${employee.employee_id}`);
            console.log(`   Name: ${employee.name}`);
            console.log(`   NIC: ${employee.NIC}`);
            console.log(`   Role: ${employee.role}`);
            console.log(`   Department: ${employee.department}`);
            console.log(`   Status: ${employee.status}`);
            console.log(`   Date of Birth: ${employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'N/A'}`);
            console.log(`   Basic Salary: ${employee.basic_salary}`);
            console.log('   ---');
        });
        
        // Verify the required fields are present
        const requiredFields = ['id', 'employee_id', 'name', 'NIC', 'role', 'status', 'date_of_birth', 'department'];
        
        employees.forEach((employee, index) => {
            const missingFields = requiredFields.filter(field => !employee.hasOwnProperty(field));
            if (missingFields.length > 0) {
                console.log(`❌ Employee ${index + 1} missing fields: ${missingFields.join(', ')}`);
            } else {
                console.log(`✅ Employee ${index + 1} has all required fields`);
            }
        });
        
        console.log('\n🎉 API test completed successfully!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

testEmployeeAPI();