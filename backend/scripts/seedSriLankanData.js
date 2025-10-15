import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB - dairy_shop database\n');
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Sri Lankan employee data for Finance Module
const financeAllowances = [
  {
    employeeId: 'EMP001',
    employeeName: 'Nimal Perera',
    allowanceType: 'Transport',
    amount: 15000,
    month: '2025-10',
    status: 'Approved',
    description: 'Monthly transport allowance for Colombo area'
  },
  {
    employeeId: 'EMP002',
    employeeName: 'Kumari Silva',
    allowanceType: 'Meal',
    amount: 12000,
    month: '2025-10',
    status: 'Approved',
    description: 'Monthly meal allowance'
  },
  {
    employeeId: 'EMP003',
    employeeName: 'Chaminda Fernando',
    allowanceType: 'Housing',
    amount: 25000,
    month: '2025-10',
    status: 'Approved',
    description: 'Housing allowance for relocated employee'
  },
  {
    employeeId: 'EMP004',
    employeeName: 'Sanduni Jayawardena',
    allowanceType: 'Mobile',
    amount: 5000,
    month: '2025-10',
    status: 'Approved',
    description: 'Mobile phone allowance'
  },
  {
    employeeId: 'EMP005',
    employeeName: 'Roshan Wickramasinghe',
    allowanceType: 'Overtime',
    amount: 18000,
    month: '2025-10',
    status: 'Pending',
    description: 'Overtime allowance for September'
  }
];

const additionalExpenses = [
  {
    category: 'Equipment',
    description: 'Milk pasteurization machine maintenance',
    amount: 85000,
    date: new Date('2025-09-15'),
    paymentMethod: 'Bank Transfer',
    vendor: 'Ceylon Engineering Ltd',
    status: 'Paid'
  },
  {
    category: 'Utilities',
    description: 'Electricity bill - Nugegoda factory',
    amount: 125000,
    date: new Date('2025-09-20'),
    paymentMethod: 'Online',
    vendor: 'Ceylon Electricity Board',
    status: 'Paid'
  },
  {
    category: 'Transport',
    description: 'Fuel for delivery trucks',
    amount: 65000,
    date: new Date('2025-09-25'),
    paymentMethod: 'Cash',
    vendor: 'IOC Sri Lanka',
    status: 'Paid'
  },
  {
    category: 'Maintenance',
    description: 'Cold storage unit repair',
    amount: 45000,
    date: new Date('2025-09-28'),
    paymentMethod: 'Bank Transfer',
    vendor: 'Cool Tech Pvt Ltd',
    status: 'Paid'
  },
  {
    category: 'Marketing',
    description: 'Newspaper advertisements',
    amount: 35000,
    date: new Date('2025-10-01'),
    paymentMethod: 'Cheque',
    vendor: 'Lake House Publishers',
    status: 'Pending'
  }
];

const salarySlips = [
  {
    salarySlipId: 'SLIP-2025-10-001',
    employeeId: 'EMP001',
    employeeName: 'Nimal Perera',
    designation: 'Production Manager',
    department: 'Manufacturing',
    month: '2025-10',
    basicSalary: 85000,
    allowances: 15000,
    deductions: 8500,
    netSalary: 91500,
    epfEmployee: 8500,
    epfEmployer: 12000,
    etf: 2550
  },
  {
    salarySlipId: 'SLIP-2025-10-002',
    employeeId: 'EMP002',
    employeeName: 'Kumari Silva',
    designation: 'Quality Control Officer',
    department: 'Quality Assurance',
    month: '2025-10',
    basicSalary: 75000,
    allowances: 12000,
    deductions: 7500,
    netSalary: 79500,
    epfEmployee: 7500,
    epfEmployer: 10500,
    etf: 2250
  },
  {
    salarySlipId: 'SLIP-2025-10-003',
    employeeId: 'EMP003',
    employeeName: 'Chaminda Fernando',
    designation: 'Finance Manager',
    department: 'Finance',
    month: '2025-10',
    basicSalary: 95000,
    allowances: 25000,
    deductions: 9500,
    netSalary: 110500,
    epfEmployee: 9500,
    epfEmployer: 13300,
    etf: 2850
  }
];

// HR Employee data with Sri Lankan details
const hrEmployees = [
  {
    employeeId: 'EMP001',
    firstName: 'Nimal',
    lastName: 'Perera',
    email: 'nimal.perera@dairylicious.lk',
    phone: '+94 77 123 4567',
    nic: '850234567V',
    address: '123, Galle Road, Colombo 03',
    city: 'Colombo',
    province: 'Western',
    dateOfBirth: new Date('1985-05-15'),
    dateOfJoining: new Date('2020-01-15'),
    department: 'Manufacturing',
    designation: 'Production Manager',
    employmentType: 'Permanent',
    basicSalary: 85000,
    status: 'Active'
  },
  {
    employeeId: 'EMP002',
    firstName: 'Kumari',
    lastName: 'Silva',
    email: 'kumari.silva@dairylicious.lk',
    phone: '+94 71 234 5678',
    nic: '900123456V',
    address: '45, Main Street, Nugegoda',
    city: 'Nugegoda',
    province: 'Western',
    dateOfBirth: new Date('1990-08-20'),
    dateOfJoining: new Date('2021-03-10'),
    department: 'Quality Assurance',
    designation: 'Quality Control Officer',
    employmentType: 'Permanent',
    basicSalary: 75000,
    status: 'Active'
  },
  {
    employeeId: 'EMP003',
    firstName: 'Chaminda',
    lastName: 'Fernando',
    email: 'chaminda.fernando@dairylicious.lk',
    phone: '+94 76 345 6789',
    nic: '880567890V',
    address: '78, Temple Road, Kandy',
    city: 'Kandy',
    province: 'Central',
    dateOfBirth: new Date('1988-12-10'),
    dateOfJoining: new Date('2019-06-01'),
    department: 'Finance',
    designation: 'Finance Manager',
    employmentType: 'Permanent',
    basicSalary: 95000,
    status: 'Active'
  },
  {
    employeeId: 'EMP004',
    firstName: 'Sanduni',
    lastName: 'Jayawardena',
    email: 'sanduni.j@dairylicious.lk',
    phone: '+94 75 456 7890',
    nic: '920345678V',
    address: '234, Station Road, Matara',
    city: 'Matara',
    province: 'Southern',
    dateOfBirth: new Date('1992-03-25'),
    dateOfJoining: new Date('2022-01-15'),
    department: 'Human Resources',
    designation: 'HR Executive',
    employmentType: 'Permanent',
    basicSalary: 65000,
    status: 'Active'
  },
  {
    employeeId: 'EMP005',
    firstName: 'Roshan',
    lastName: 'Wickramasinghe',
    email: 'roshan.w@dairylicious.lk',
    phone: '+94 70 567 8901',
    nic: '950678901V',
    address: '56, Lake Road, Kurunegala',
    city: 'Kurunegala',
    province: 'North Western',
    dateOfBirth: new Date('1995-07-18'),
    dateOfJoining: new Date('2023-02-20'),
    department: 'Logistics',
    designation: 'Logistics Coordinator',
    employmentType: 'Contract',
    basicSalary: 55000,
    status: 'Active'
  }
];

// HR Attendance data
const hrAttendances = [
  {
    employee_id: 'EMP001',
    employeeName: 'Nimal Perera',
    date: new Date('2025-10-07'),
    month: '2025-10',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'Present',
    workingHours: 9
  },
  {
    employee_id: 'EMP002',
    employeeName: 'Kumari Silva',
    date: new Date('2025-10-07'),
    month: '2025-10',
    checkIn: '08:15',
    checkOut: '17:15',
    status: 'Present',
    workingHours: 9
  },
  {
    employee_id: 'EMP003',
    employeeName: 'Chaminda Fernando',
    date: new Date('2025-10-07'),
    month: '2025-10',
    checkIn: '08:30',
    checkOut: '17:30',
    status: 'Present',
    workingHours: 9
  },
  {
    employee_id: 'EMP004',
    employeeName: 'Sanduni Jayawardena',
    date: new Date('2025-10-07'),
    month: '2025-10',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    workingHours: 9
  },
  {
    employee_id: 'EMP005',
    employeeName: 'Roshan Wickramasinghe',
    date: new Date('2025-10-07'),
    month: '2025-10',
    status: 'Absent',
    workingHours: 0
  }
];

// HR Leave applications
const hrLeaves = [
  {
    leave_id: 'LEAVE-2025-10-001',
    employeeId: 'EMP001',
    employeeName: 'Nimal Perera',
    leaveType: 'Annual',
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-10-17'),
    numberOfDays: 3,
    reason: 'Family vacation to Nuwara Eliya',
    status: 'Approved'
  },
  {
    leave_id: 'LEAVE-2025-10-002',
    employeeId: 'EMP002',
    employeeName: 'Kumari Silva',
    leaveType: 'Sick',
    startDate: new Date('2025-10-10'),
    endDate: new Date('2025-10-11'),
    numberOfDays: 2,
    reason: 'Medical treatment',
    status: 'Approved'
  },
  {
    leave_id: 'LEAVE-2025-10-003',
    employeeId: 'EMP004',
    employeeName: 'Sanduni Jayawardena',
    leaveType: 'Casual',
    startDate: new Date('2025-10-12'),
    endDate: new Date('2025-10-12'),
    numberOfDays: 1,
    reason: 'Personal matter',
    status: 'Pending'
  }
];

// HR Payroll data
const hrPayrolls = [
  {
    employeeId: 'EMP001',
    employeeIdDisplay: 'EMP001',
    employeeName: 'Nimal Perera',
    month: '2025-10',
    basicSalary: 85000,
    allowances: 15000,
    overtime: 8000,
    bonuses: 10000,
    deductions: 8500,
    epf: 8500,
    etf: 2550,
    netSalary: 109500,
    status: 'Processed',
    paymentDate: new Date('2025-10-01')
  },
  {
    employeeId: 'EMP002',
    employeeIdDisplay: 'EMP002',
    employeeName: 'Kumari Silva',
    month: '2025-10',
    basicSalary: 75000,
    allowances: 12000,
    overtime: 5000,
    bonuses: 5000,
    deductions: 7500,
    epf: 7500,
    etf: 2250,
    netSalary: 89750,
    status: 'Processed',
    paymentDate: new Date('2025-10-01')
  },
  {
    employeeId: 'EMP003',
    employeeIdDisplay: 'EMP003',
    employeeName: 'Chaminda Fernando',
    month: '2025-10',
    basicSalary: 95000,
    allowances: 25000,
    overtime: 0,
    bonuses: 15000,
    deductions: 9500,
    epf: 9500,
    etf: 2850,
    netSalary: 125500,
    status: 'Processed',
    paymentDate: new Date('2025-10-01')
  }
];

// Order Management data with Sri Lankan customers
const orders = [
  {
    orderNumber: 'ORD-001001',
    customerName: 'Sunil Rajapaksa',
    customerEmail: 'sunil.r@email.lk',
    customerPhone: '+94 77 111 2222',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 20, price: 250, total: 5000 },
      { productName: 'Curd 400ml', quantity: 15, price: 120, total: 1800 },
    ],
    totalAmount: 6800,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '234, Duplication Road',
      city: 'Colombo 04',
      state: 'Western Province',
      zipCode: '00400',
    },
    orderDate: new Date('2025-10-01'),
    deliveryDate: new Date('2025-10-02'),
    notes: 'Morning delivery preferred'
  },
  {
    orderNumber: 'ORD-001002',
    customerName: 'Dilini Wickramaratne',
    customerEmail: 'dilini.w@gmail.com',
    customerPhone: '+94 71 333 4444',
    items: [
      { productName: 'Yogurt 500ml', quantity: 25, price: 180, total: 4500 },
      { productName: 'Butter 250g', quantity: 10, price: 450, total: 4500 },
    ],
    totalAmount: 9000,
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '45, Peradeniya Road',
      city: 'Kandy',
      state: 'Central Province',
      zipCode: '20000',
    },
    orderDate: new Date('2025-10-06'),
    notes: 'Call before delivery'
  },
  {
    orderNumber: 'ORD-001003',
    customerName: 'Kasun Jayasuriya',
    customerEmail: 'kasun.j@yahoo.com',
    customerPhone: '+94 76 555 6666',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 30, price: 250, total: 7500 },
      { productName: 'Cheese 200g', quantity: 8, price: 550, total: 4400 },
      { productName: 'Ice Cream 1L', quantity: 5, price: 680, total: 3400 },
    ],
    totalAmount: 15300,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    deliveryAddress: {
      street: '123, Beach Road',
      city: 'Galle',
      state: 'Southern Province',
      zipCode: '80000',
    },
    orderDate: new Date('2025-10-07'),
    notes: 'Restaurant order - bulk delivery'
  },
  {
    orderNumber: 'ORD-001004',
    customerName: 'Nethmi Fernando',
    customerEmail: 'nethmi.f@hotmail.com',
    customerPhone: '+94 75 777 8888',
    items: [
      { productName: 'Yogurt 500ml', quantity: 12, price: 180, total: 2160 },
      { productName: 'Curd 400ml', quantity: 10, price: 120, total: 1200 },
    ],
    totalAmount: 3360,
    status: 'Completed',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '67, Hospital Road',
      city: 'Negombo',
      state: 'Western Province',
      zipCode: '11500',
    },
    orderDate: new Date('2025-10-05'),
    deliveryDate: new Date('2025-10-06'),
  },
  {
    orderNumber: 'ORD-001005',
    customerName: 'Tharindu Silva',
    customerEmail: 'tharindu.s@outlook.com',
    customerPhone: '+94 70 999 0000',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 50, price: 250, total: 12500 },
      { productName: 'Butter 250g', quantity: 20, price: 450, total: 9000 },
    ],
    totalAmount: 21500,
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '89, Main Street',
      city: 'Kurunegala',
      state: 'North Western Province',
      zipCode: '60000',
    },
    orderDate: new Date('2025-10-07'),
    notes: 'Hotel order - deliver by 6 AM'
  }
];

async function seedAllData() {
  const db = await connectDB();

  try {
    console.log('🗑️  Clearing existing data...\n');

    // Clear existing data using direct collection access
    await db.collection('employeeallowances').deleteMany({});
    await db.collection('additionalexpenses').deleteMany({});
    await db.collection('employeesalaryslips').deleteMany({});
    await db.collection('employees').deleteMany({});
    await db.collection('attendances').deleteMany({});
    await db.collection('leaves').deleteMany({});
    await db.collection('payrolls').deleteMany({});
    await db.collection('ordermanagements').deleteMany({});

    console.log('✅ Cleared all collections\n');

    // Insert Finance data
    console.log('💰 Seeding Finance Module...');
    await db.collection('employeeallowances').insertMany(financeAllowances);
    console.log(`   ✓ Added ${financeAllowances.length} allowances`);
    
    await db.collection('additionalexpenses').insertMany(additionalExpenses);
    console.log(`   ✓ Added ${additionalExpenses.length} additional expenses`);
    
    await db.collection('employeesalaryslips').insertMany(salarySlips);
    console.log(`   ✓ Added ${salarySlips.length} salary slips\n`);

    // Insert HR data
    console.log('👥 Seeding HR Module...');
    await db.collection('employees').insertMany(hrEmployees);
    console.log(`   ✓ Added ${hrEmployees.length} employees`);
    
    await db.collection('attendances').insertMany(hrAttendances);
    console.log(`   ✓ Added ${hrAttendances.length} attendance records`);
    
    await db.collection('leaves').insertMany(hrLeaves);
    console.log(`   ✓ Added ${hrLeaves.length} leave applications`);
    
    await db.collection('payrolls').insertMany(hrPayrolls);
    console.log(`   ✓ Added ${hrPayrolls.length} payroll records\n`);

    // Insert Order Management data
    console.log('📋 Seeding Order Management Module...');
    await db.collection('ordermanagements').insertMany(orders);
    console.log(`   ✓ Added ${orders.length} orders\n`);

    // Display summary
    console.log('='.repeat(70));
    console.log('✨ DATABASE SEEDED SUCCESSFULLY WITH SRI LANKAN DATA');
    console.log('='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`   Finance Module: ${financeAllowances.length + additionalExpenses.length + salarySlips.length} records`);
    console.log(`   HR Module: ${hrEmployees.length + hrAttendances.length + hrLeaves.length + hrPayrolls.length} records`);
    console.log(`   Order Management: ${orders.length} records`);
    console.log(`   Total Records: ${financeAllowances.length + additionalExpenses.length + salarySlips.length + hrEmployees.length + hrAttendances.length + hrLeaves.length + hrPayrolls.length + orders.length}`);
    console.log('\n✅ All data uses Sri Lankan names, addresses, and phone numbers');
    console.log('✅ Currency in Sri Lankan Rupees (Rs.)');
    console.log('✅ Addresses from major cities: Colombo, Kandy, Galle, Matara, Kurunegala, Negombo\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedAllData();
