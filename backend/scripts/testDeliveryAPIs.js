import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8000/api';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
};

async function testAPI(endpoint, method = 'GET', description) {
  try {
    console.log(`\n${colors.blue}Testing: ${description}${colors.reset}`);
    console.log(`${colors.yellow}${method} ${endpoint}${colors.reset}`);
    
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      const count = Array.isArray(data.data) ? data.data.length : 1;
      console.log(`${colors.green}✓ SUCCESS${colors.reset} - ${count} record(s) fetched`);
      if (Array.isArray(data.data) && data.data.length > 0) {
        console.log(`${colors.magenta}Sample:${colors.reset}`, JSON.stringify(data.data[0], null, 2).substring(0, 200) + '...');
      }
      return { success: true, count };
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset} - ${response.status}: ${data.message || 'Unknown error'}`);
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset} - ${error.message}`);
    return { success: false, count: 0 };
  }
}

async function testDeliveryAPIs() {
  console.log('\n' + '='.repeat(70));
  console.log('🚚 TESTING DELIVERY MODULE APIs');
  console.log('='.repeat(70));
  
  const results = [];
  
  // Test Delivery APIs
  console.log('\n📦 DELIVERIES:');
  results.push(await testAPI('/delivery/deliveries', 'GET', 'Get all deliveries'));
  results.push(await testAPI('/delivery/deliveries/status/Delivered', 'GET', 'Get delivered orders'));
  results.push(await testAPI('/delivery/deliveries/status/Pending', 'GET', 'Get pending orders'));
  results.push(await testAPI('/delivery/deliveries/status/In Transit', 'GET', 'Get in-transit orders'));
  
  // Test Driver APIs
  console.log('\n\n🚗 DRIVERS:');
  results.push(await testAPI('/delivery/drivers', 'GET', 'Get all drivers'));
  
  // Test Farmer APIs
  console.log('\n\n👨‍🌾 FARMERS:');
  results.push(await testAPI('/delivery/farmers', 'GET', 'Get all farmers'));
  
  // Test Milk Collection APIs
  console.log('\n\n🥛 MILK COLLECTIONS:');
  results.push(await testAPI('/delivery/milk-collection', 'GET', 'Get all milk collections'));
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(70));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
  
  console.log(`${colors.green}✓ Successful tests: ${successful}${colors.reset}`);
  console.log(`${colors.red}✗ Failed tests: ${failed}${colors.reset}`);
  console.log(`${colors.blue}📋 Total records fetched: ${totalRecords}${colors.reset}`);
  console.log('='.repeat(70) + '\n');
  
  process.exit(0);
}

testDeliveryAPIs();
