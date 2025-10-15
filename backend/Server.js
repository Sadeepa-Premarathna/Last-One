import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Finance Routes
import allowanceRoutes from './features/finance/finance_Routes/AllowanceRoutes.js';
import additionalExpensesRoutes from './features/finance/finance_Routes/finance_AdditionalExpensesRoutes.js';
import salarySlipRoutes from './features/finance/finance_Routes/salarySlipRoutes.js';

// HR Routes
import hrEmployeeRoutes from './features/hr/Routes/HREmployeeRoutes.js';
import hrAttendanceRoutes from './features/hr/Routes/HRAttendanceRoutes.js';
import hrLeaveRoutes from './features/hr/Routes/HRLeaveRoutes.js';
import hrPayrollRoutes from './features/hr/Routes/HRPayrollRoutes.js';

// Employee Routes
import employeeRoutes from './features/employee/employee_Routes/EmployeeRoutes.js';
import employeeAttendanceRoutes from './features/employee/employee_Routes/AttendanceRoutes.js';
import employeeLeaveRoutes from './features/employee/employee_Routes/LeaveRoutes.js';

// Inventory Routes
import inventoryRoutes from './features/inventory/Inventoryroutes/inventoryRoutes.js';
import inventoryMilkCollectionRoutes from './features/inventory/Inventoryroutes/inventoryMilkCollectionRoutes.js';
import inventoryRawMilkRoutes from './features/inventory/Inventoryroutes/inventoryRawMilkRoutes.js';

// Delivery Routes
import deliveryRoutes from './features/delivery/routes/deliveryRoutes.js';
import driverRoutes from './features/delivery/routes/driverRoutes.js';
import farmerRoutes from './features/delivery/routes/farmerRoutes.js';
import milkCollectionRoutes from './features/delivery/routes/milkCollectionRoutes.js';
import deliveryOrderRoutes from './features/delivery/routes/orderRoutes.js';
import paymentRoutes from './features/delivery/routes/paymentRoutes.js';

// Order Management Routes
import orderManagementRoutes from './features/order/order_Routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to Database
connectDB();

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dairy Licious Management System API',
    version: '2.0.0',
    status: 'Active',
    modules: {
      finance: {
        allowances: '/api/finance/allowances',
        expenses: '/api/finance/expenses',
        salarySlips: '/api/finance/salary-slips'
      },
      hr: {
        employees: '/api/hr/employees',
        attendance: '/api/hr/attendance',
        leaves: '/api/hr/leaves',
        payroll: '/api/hr/payroll'
      },
      employee: {
        employees: '/api/employee/employees',
        attendance: '/api/employee/attendance',
        leaves: '/api/employee/leaves'
      },
      inventory: {
        products: '/api/inventory/products',
        milkCollection: '/api/inventory/milk-collection',
        rawMilk: '/api/inventory/raw-milk'
      },
      delivery: {
        deliveries: '/api/delivery/deliveries',
        drivers: '/api/delivery/drivers',
        farmers: '/api/delivery/farmers',
        milkCollection: '/api/delivery/milk-collection',
        orders: '/api/delivery/orders',
        payments: '/api/delivery/payments'
      },
      orderManagement: {
        orders: '/api/order/orders',
        stats: '/api/order/stats'
      }
    }
  });
});

// Finance Routes
app.use('/api/finance/allowances', allowanceRoutes);
app.use('/api/finance/expenses', additionalExpensesRoutes);
app.use('/api/finance/salary-slips', salarySlipRoutes);

// HR Routes
app.use('/api/hr/employees', hrEmployeeRoutes);
app.use('/api/hr/attendance', hrAttendanceRoutes);
app.use('/api/hr/leaves', hrLeaveRoutes);
app.use('/api/hr/payroll', hrPayrollRoutes);

// Employee Routes
app.use('/api/employee/employees', employeeRoutes);
app.use('/api/employee/attendance', employeeAttendanceRoutes);
app.use('/api/employee/leaves', employeeLeaveRoutes);

// Inventory Routes
app.use('/api/inventory/products', inventoryRoutes);
app.use('/api/inventory/milk-collection', inventoryMilkCollectionRoutes);
app.use('/api/inventory/raw-milk', inventoryRawMilkRoutes);

// Delivery Routes
app.use('/api/delivery/deliveries', deliveryRoutes);
app.use('/api/delivery/drivers', driverRoutes);
app.use('/api/delivery/farmers', farmerRoutes);
app.use('/api/delivery/milk-collection', milkCollectionRoutes);
app.use('/api/delivery/orders', deliveryOrderRoutes);
app.use('/api/delivery/payments', paymentRoutes);

// Order Management Routes
app.use('/api/order', orderManagementRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('\n📦 Available Modules:');
  console.log('   ├─ 💰 Finance (Allowances, Expenses, Salary Slips)');
  console.log('   ├─ 👥 HR (Employees, Attendance, Leaves, Payroll)');
  console.log('   ├─ 👔 Employee (Employees, Attendance, Leaves)');
  console.log('   ├─ 📦 Inventory (Products, Milk Collection, Raw Milk)');
  console.log('   ├─ 🚚 Delivery (Deliveries, Drivers, Farmers, Orders, Payments)');
  console.log('   └─ 📋 Order Management (Orders, Statistics)');
  console.log('\n');
});

export default app;
