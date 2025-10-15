// Test database connection step by step
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8000/api';

console.log('\n' + '='.repeat(70));
console.log('🔌 TESTING DATABASE CONNECTION - STEP BY STEP');
console.log('='.repeat(70) + '\n');

// Helper function to test an endpoint
async function testEndpoint(name, url) {
  try {
    console.log(`\n📡 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.success) {
      const count = Array.isArray(data.data) ? data.data.length : 1;
      console.log(`   ✅ SUCCESS - ${count} records fetched`);
      
      if (Array.isArray(data.data) && data.data.length > 0) {
        console.log(`   📄 Sample Record:`, JSON.stringify(data.data[0]).substring(0, 150) + '...');
      }
      return true;
    } else {
      console.log(`   ❌ FAILED - ${response.status}: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
    return false;
  }
}

// Test each module one by one
async function testAllModules() {
  console.log('Starting tests in 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let results = [];
  
  // 1. Finance Module
  console.log('\n' + '─'.repeat(70));
  console.log('💰 FINANCE MODULE');
  console.log('─'.repeat(70));
  results.push(await testEndpoint('Allowances', `${API_BASE}/finance/allowances`));
  results.push(await testEndpoint('Additional Expenses', `${API_BASE}/finance/expenses`));
  results.push(await testEndpoint('Salary Slips', `${API_BASE}/finance/salary-slips`));
  
  // 2. HR Module
  console.log('\n' + '─'.repeat(70));
  console.log('👥 HR MODULE');
  console.log('─'.repeat(70));
  results.push(await testEndpoint('Employees', `${API_BASE}/hr/employees`));
  results.push(await testEndpoint('Attendance', `${API_BASE}/hr/attendance`));
  results.push(await testEndpoint('Leaves', `${API_BASE}/hr/leaves`));
  results.push(await testEndpoint('Payroll', `${API_BASE}/hr/payroll`));
  
  // 3. Delivery Module
  console.log('\n' + '─'.repeat(70));
  console.log('🚚 DELIVERY MODULE');
  console.log('─'.repeat(70));
  results.push(await testEndpoint('Deliveries', `${API_BASE}/delivery/deliveries`));
  results.push(await testEndpoint('Drivers', `${API_BASE}/delivery/drivers`));
  results.push(await testEndpoint('Farmers', `${API_BASE}/delivery/farmers`));
  results.push(await testEndpoint('Milk Collections', `${API_BASE}/delivery/milk-collection`));
  
  // 4. Order Management Module
  console.log('\n' + '─'.repeat(70));
  console.log('📋 ORDER MANAGEMENT MODULE');
  console.log('─'.repeat(70));
  results.push(await testEndpoint('Orders', `${API_BASE}/order/orders`));
  
  // Summary
  const successful = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);
  
  if (successful === results.length) {
    console.log('\n🎉 ALL MODULES CONNECTED SUCCESSFULLY!');
    console.log('✅ Database is fully connected and operational');
  } else if (successful > 0) {
    console.log('\n⚠️ PARTIAL SUCCESS - Some modules are working');
  } else {
    console.log('\n❌ CONNECTION FAILED - Please check if server is running');
  }
  
  console.log('='.repeat(70) + '\n');
  process.exit(0);
}

testAllModules();
