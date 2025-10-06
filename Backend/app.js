import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import AdditionalExpensesRoutes from './Routes/finance_AdditionalExpensesRoutes.js';
import AllowanceRoutes from './Routes/AllowanceRoutes.js';
import SalarySlipRoutes from './Routes/salarySlipRoutes.js';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/api/additional-expenses', AdditionalExpensesRoutes);
app.use('/api/allowances', AllowanceRoutes);
app.use('/api/salary-slip', SalarySlipRoutes);

if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI environment variable. Create a .env file with MONGODB_URI.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'test' })
  .then(async () => {
      const conn = mongoose.connection;
      const dbName = conn?.name;
      const host = conn?.host;
      console.log(`Connected to MongoDB db=${dbName} host=${host}`);
      
      // Auto-generate salary slips on server start
      try {
        const { autoGenerateSalarySlipsForPayroll, getMockPayrollData } = await import('./Controllers/salarySlipController.js');
        
        // Always check for new payroll records and generate salary slips
        const EmployeeSalarySlip = (await import('./Model/EmployeeSalarySlip.js')).default;
        const existingSlips = await EmployeeSalarySlip.countDocuments();
        
        console.log(`📊 Found ${existingSlips} existing salary slips. Checking for new payroll records...`);
        
        const payrollData = getMockPayrollData();
        console.log(`📋 Found ${payrollData.length} payroll records in mock data`);
        
        const result = await autoGenerateSalarySlipsForPayroll(payrollData);
        
        if (result.success) {
          console.log(`✅ Auto-generation completed!`);
          console.log(`📊 Created: ${result.results.created}, Skipped: ${result.results.skipped}, Errors: ${result.results.errors.length}`);
        } else {
          console.log('⚠️  Auto-generation failed:', result.message);
        }
      } catch (error) {
        console.log('⚠️  Auto-generation failed:', error.message);
      }
      
      app.listen(process.env.PORT || 8000, () => {
          console.log(`Server running on http://localhost:${process.env.PORT || 8000}`);
      });
  })
  .catch((err) => console.log(err));