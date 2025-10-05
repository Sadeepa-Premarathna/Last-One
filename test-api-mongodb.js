import axios from 'axios';

async function testEmployeeAPI() {
    try {
        console.log('🧪 Testing Employee API with MongoDB...');
        
        const response = await axios.get('http://localhost:8003/api/employees');
        const employees = response.data;
        
        console.log(`✅ API Response: ${employees.length} employees found`);
        console.log('📋 Employees from MongoDB:');
        
        employees.forEach((employee, index) => {
            console.log(`${index + 1}. ${employee.name} (${employee.employee_id})`);
            console.log(`   Role: ${employee.role}`);
            console.log(`   Department: ${employee.department}`);
            console.log(`   Status: ${employee.status}`);
            console.log('   ---');
        });
        
        // Check if we're getting the MongoDB employees (not JSON fallback)
        const mongoEmployees = ['Rashmini Kavindya', 'januja Methsara', 'Janani Navodya', 'David thompson', 'Tom hiddleston', 'Piyumi Bhagya', 'Andrew Garfield'];
        const jsonEmployees = ['John Doe', 'Jane Smith', 'Mike Johnson'];
        
        const hasMongoData = employees.some(emp => mongoEmployees.includes(emp.name));
        const hasJsonData = employees.some(emp => jsonEmployees.includes(emp.name));
        
        if (hasMongoData && !hasJsonData) {
            console.log('🎉 SUCCESS: API is returning MongoDB data!');
        } else if (hasJsonData) {
            console.log('⚠️  WARNING: API is still returning JSON fallback data');
        } else {
            console.log('❓ UNKNOWN: Data source unclear');
        }
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testEmployeeAPI();