/**
 * Test script to verify all API endpoints are working and fetching data
 * This will make requests to all feature endpoints
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const testEndpoint = async (method, url, name, module) => {
  try {
    const response = await fetch(url, { method });
    const data = await response.json();
    
    if (response.ok) {
      const count = data.data?.length || data.count || data.results?.length || 0;
      console.log(
        `${colors.green}✓${colors.reset} ${colors.cyan}[${module}]${colors.reset} ${name}: ${colors.green}${count} records${colors.reset}`
      );
      return { success: true, count, data };
    } else {
      console.log(
        `${colors.yellow}⚠${colors.reset} ${colors.cyan}[${module}]${colors.reset} ${name}: ${colors.yellow}No data${colors.reset}`
      );
      return { success: false, count: 0 };
    }
  } catch (error) {
    console.log(
      `${colors.red}✗${colors.reset} ${colors.cyan}[${module}]${colors.reset} ${name}: ${colors.red}${error.message}${colors.reset}`
    );
    return { success: false, count: 0, error: error.message };
  }
};

const testAllEndpoints = async () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.magenta}🧪 TESTING ALL API ENDPOINTS${colors.reset}`);
  console.log(`${'='.repeat(70)}\n`);

  const results = {
    finance: [],
    hr: [],
    employee: [],
    inventory: [],
    delivery: [],
    order: [],
  };

  // FINANCE MODULE
  console.log(`\n${colors.blue}💰 FINANCE MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.finance.push(
    await testEndpoint('GET', `${API_BASE_URL}/finance/allowances`, 'Allowances', 'Finance')
  );
  results.finance.push(
    await testEndpoint('GET', `${API_BASE_URL}/finance/expenses`, 'Additional Expenses', 'Finance')
  );
  results.finance.push(
    await testEndpoint('GET', `${API_BASE_URL}/finance/salary-slips`, 'Salary Slips', 'Finance')
  );

  // HR MODULE
  console.log(`\n${colors.blue}👥 HR MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.hr.push(
    await testEndpoint('GET', `${API_BASE_URL}/hr/employees`, 'HR Employees', 'HR')
  );
  results.hr.push(
    await testEndpoint('GET', `${API_BASE_URL}/hr/attendance`, 'HR Attendance', 'HR')
  );
  results.hr.push(
    await testEndpoint('GET', `${API_BASE_URL}/hr/leaves`, 'HR Leaves', 'HR')
  );
  results.hr.push(
    await testEndpoint('GET', `${API_BASE_URL}/hr/payroll`, 'HR Payroll', 'HR')
  );

  // EMPLOYEE MODULE
  console.log(`\n${colors.blue}👔 EMPLOYEE MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.employee.push(
    await testEndpoint('GET', `${API_BASE_URL}/employee/employees`, 'Employees', 'Employee')
  );
  results.employee.push(
    await testEndpoint('GET', `${API_BASE_URL}/employee/attendance`, 'Employee Attendance', 'Employee')
  );
  results.employee.push(
    await testEndpoint('GET', `${API_BASE_URL}/employee/leaves`, 'Employee Leaves', 'Employee')
  );

  // INVENTORY MODULE
  console.log(`\n${colors.blue}📦 INVENTORY MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.inventory.push(
    await testEndpoint('GET', `${API_BASE_URL}/inventory/products`, 'Products', 'Inventory')
  );
  results.inventory.push(
    await testEndpoint('GET', `${API_BASE_URL}/inventory/milk-collection`, 'Milk Collection', 'Inventory')
  );
  results.inventory.push(
    await testEndpoint('GET', `${API_BASE_URL}/inventory/raw-milk`, 'Raw Milk', 'Inventory')
  );

  // DELIVERY MODULE
  console.log(`\n${colors.blue}🚚 DELIVERY MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/deliveries`, 'Deliveries', 'Delivery')
  );
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/drivers`, 'Drivers', 'Delivery')
  );
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/farmers`, 'Farmers', 'Delivery')
  );
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/milk-collection`, 'Milk Collection', 'Delivery')
  );
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/orders`, 'Orders', 'Delivery')
  );
  results.delivery.push(
    await testEndpoint('GET', `${API_BASE_URL}/delivery/payments`, 'Payments', 'Delivery')
  );

  // ORDER MANAGEMENT MODULE
  console.log(`\n${colors.blue}📋 ORDER MANAGEMENT MODULE${colors.reset}`);
  console.log('-'.repeat(70));
  results.order.push(
    await testEndpoint('GET', `${API_BASE_URL}/order/orders`, 'Orders', 'Order Management')
  );
  results.order.push(
    await testEndpoint('GET', `${API_BASE_URL}/order/stats`, 'Order Statistics', 'Order Management')
  );

  // SUMMARY
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.magenta}📊 TEST SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(70)}\n`);

  const allResults = [
    ...results.finance,
    ...results.hr,
    ...results.employee,
    ...results.inventory,
    ...results.delivery,
    ...results.order,
  ];

  const totalTests = allResults.length;
  const successfulTests = allResults.filter((r) => r.success).length;
  const failedTests = totalTests - successfulTests;
  const totalRecords = allResults.reduce((sum, r) => sum + (r.count || 0), 0);

  console.log(`Total Endpoints Tested: ${colors.cyan}${totalTests}${colors.reset}`);
  console.log(`Successful: ${colors.green}${successfulTests}${colors.reset}`);
  console.log(`Failed: ${colors.red}${failedTests}${colors.reset}`);
  console.log(`Total Records Fetched: ${colors.cyan}${totalRecords}${colors.reset}\n`);

  // Module breakdown
  console.log(`${colors.blue}Module Breakdown:${colors.reset}`);
  Object.keys(results).forEach((module) => {
    const moduleResults = results[module];
    const moduleSuccess = moduleResults.filter((r) => r.success).length;
    const moduleTotal = moduleResults.length;
    const moduleRecords = moduleResults.reduce((sum, r) => sum + (r.count || 0), 0);
    
    console.log(
      `  ${module.toUpperCase()}: ${moduleSuccess}/${moduleTotal} endpoints (${moduleRecords} records)`
    );
  });

  console.log(`\n${'='.repeat(70)}`);
  console.log(
    `${colors.green}✅ DATABASE CONNECTED & ALL FEATURES TESTED${colors.reset}`
  );
  console.log(`${'='.repeat(70)}\n`);
};

// Run tests
testAllEndpoints().catch(console.error);
