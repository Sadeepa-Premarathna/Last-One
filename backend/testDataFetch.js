// Test script to fetch all data from database
// Run this from backend folder: node testDataFetch.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

async function fetchAllData() {
  console.log(`${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║         FETCHING ALL DATA FROM DATABASE                   ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const endpoints = [
    { name: 'Drivers', url: '/drivers', icon: '🚗' },
    { name: 'Farmers', url: '/farmers', icon: '👨‍🌾' },
    { name: 'Orders', url: '/orders', icon: '📦' },
    { name: 'Deliveries', url: '/deliveries', icon: '🚚' },
    { name: 'Milk Collections', url: '/milk-collections', icon: '🥛' },
    { name: 'Payments', url: '/payments', icon: '💰' }
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      console.log(`${colors.yellow}Fetching ${endpoint.name}...${colors.reset}`);
      const response = await axios.get(`${API_BASE_URL}${endpoint.url}`);
      const data = response.data.data || response.data;
      results[endpoint.name] = data;
      
      console.log(`${colors.green}✓ ${endpoint.icon} ${endpoint.name}: ${data.length} records${colors.reset}`);
      
      // Show sample data if available
      if (data.length > 0) {
        const sample = data[0];
        console.log(`  ${colors.cyan}Sample:${colors.reset}`);
        const keys = Object.keys(sample).slice(0, 5);
        keys.forEach(key => {
          let value = sample[key];
          if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value).substring(0, 50) + '...';
          }
          console.log(`    ${key}: ${value}`);
        });
      } else {
        console.log(`  ${colors.yellow}(No data available)${colors.reset}`);
      }
      console.log('');
      
    } catch (error) {
      console.log(`${colors.red}✗ ${endpoint.name}: ERROR${colors.reset}`);
      console.log(`  ${colors.red}${error.message}${colors.reset}\n`);
      results[endpoint.name] = { error: error.message };
    }
  }

  // Summary
  console.log(`${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                     SUMMARY                               ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  let totalRecords = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const [name, data] of Object.entries(results)) {
    if (data.error) {
      console.log(`${colors.red}✗ ${name}: ERROR - ${data.error}${colors.reset}`);
      errorCount++;
    } else {
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`${colors.green}✓ ${name}: ${count} records${colors.reset}`);
      totalRecords += count;
      successCount++;
    }
  }

  console.log(`\n${colors.bright}Total Records: ${totalRecords}${colors.reset}`);
  console.log(`${colors.green}Successful: ${successCount}/${endpoints.length}${colors.reset}`);
  if (errorCount > 0) {
    console.log(`${colors.red}Failed: ${errorCount}/${endpoints.length}${colors.reset}`);
  }

  console.log(`\n${colors.cyan}Backend URL: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}Frontend URL: http://localhost:3001${colors.reset}\n`);

  return results;
}

// Run the test
fetchAllData()
  .then(() => {
    console.log(`${colors.green}${colors.bright}✓ Data fetch test completed!${colors.reset}\n`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`${colors.red}${colors.bright}✗ Test failed:${colors.reset}`, error.message);
    process.exit(1);
  });
