import express from 'express';
import { 
  generateSalarySlip, 
  getSalarySlipById, 
  getAllSalarySlips, 
  updatePaymentStatus,
  getAvailableEmployees,
  generateAllSalarySlips,
  autoGenerateSalarySlipsForPayroll
} from '../finance_Controllers/salarySlipController.js';
import EmployeeSalarySlip from '../finance_Model/EmployeeSalarySlip.js';

const router = express.Router();

// POST /api/salary-slip/generate-all - Generate salary slips for all employees
router.post('/generate-all', generateAllSalarySlips);

// POST /api/salary-slip/test-auto-generation - Test automatic salary slip generation (simulates payroll record creation)
router.post('/test-auto-generation', async (req, res) => {
  try {
    // Simulate creating new payroll records (this would normally come from your payroll system)
    const newPayrollRecords = [
      {
        employeeId: 'EMP006',
        employeeName: 'Lisa Johnson',
        month: '2025-10',
        basicSalary: 80000,
        overtimeAmount: 12000,
        noPayDeductionAmount: 2000
      },
      {
        employeeId: 'EMP007',
        employeeName: 'David Brown',
        month: '2025-10',
        basicSalary: 90000,
        overtimeAmount: 15000,
        noPayDeductionAmount: 3500
      }
    ];

    console.log('🧪 Testing automatic salary slip generation for new payroll records');
    
    // This simulates what would happen when payroll records are created
    const autoGenerationResult = await autoGenerateSalarySlipsForPayroll(newPayrollRecords);

    res.status(200).json({
      message: 'Automatic salary slip generation test completed',
      payrollRecordsCreated: newPayrollRecords.length,
      autoGenerationResult: autoGenerationResult
    });

  } catch (error) {
    console.error('Error in test auto-generation:', error);
    res.status(500).json({
      message: 'Error testing automatic salary slip generation',
      error: error.message
    });
  }
});

// GET /api/salary-slip/employees - Get all available employees
router.get('/employees', getAvailableEmployees);

// GET /api/salary-slip - Get all salary slips with optional filters
router.get('/', getAllSalarySlips);

// PUT /api/salary-slip/:id/status - Update payment status
router.put('/:id/status', updatePaymentStatus);

// Middleware to differentiate between ObjectId and employeeId
const handleGetRequest = (req, res, next) => {
  const { id } = req.params;
  
  // Check if the ID is a valid MongoDB ObjectId format (24 hex characters)
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  if (objectIdPattern.test(id)) {
    // It's an ObjectId, fetch salary slip by ID
    return getSalarySlipById(req, res);
  } else {
    // It's an employee ID, generate/get salary slip
    return generateSalarySlip(req, res);
  }
};

// GET /api/salary-slip/unpaid-total
router.get('/unpaid-total', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('🔍 Backend: Fetching unpaid salaries with query:', {
      startDate,
      endDate
    });

    // Try multiple payment status values
    const query = { 
      $or: [
        { paymentStatus: "Unpaid" },
        { paymentStatus: "unpaid" },
        { paymentStatus: "Pending" },
        { paymentStatus: "pending" }
      ]
    };
    
    // Convert date range to month name for monthly reports
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Check if it's the same month (for monthly reports)
      // Use the end date month since that's the actual month we want
      if (start.getFullYear() === end.getFullYear()) {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthName = monthNames[end.getMonth()];
        
        // Try multiple month formats
        query.$and = [
          { $or: [
            { month: monthName },
            { month: monthName.toLowerCase() },
            { month: monthName.toUpperCase() },
            { month: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}` },
            { month: `${end.getFullYear()}-${String(end.getMonth() + 1)}` }
          ]}
        ];
        
        console.log('📅 Filtering by month:', monthName, '(trying multiple formats)');
      } else {
        // For yearly reports, use createdAt range
        query.createdAt = { $gte: start, $lte: end };
        console.log('📅 Filtering by date range:', { start, end });
      }
    }

    console.log('📊 Backend: MongoDB query:', JSON.stringify(query, null, 2));

    // Debug: Check what documents exist
    const allSlips = await EmployeeSalarySlip.find({});
    console.log('🔍 Backend: All salary slips in database:', allSlips.map(s => ({
      id: s._id,
      month: s.month,
      paymentStatus: s.paymentStatus,
      netSalary: s.netSalary
    })));

    // Debug: Check specifically for October documents
    const octoberSlips = await EmployeeSalarySlip.find({ 
      $or: [
        { month: "October" },
        { month: "october" },
        { month: "OCTOBER" },
        { month: "2025-10" },
        { month: "2025-10" }
      ]
    });
    console.log('🔍 Backend: October salary slips found:', octoberSlips.map(s => ({
      id: s._id,
      month: s.month,
      paymentStatus: s.paymentStatus,
      netSalary: s.netSalary
    })));

    const slips = await EmployeeSalarySlip.find(query);
    const totalAmount = slips.reduce((sum, s) => sum + (s.netSalary || 0), 0);

    console.log('✅ Backend: Found unpaid slips:', {
      count: slips.length,
      totalAmount,
      slips: slips.map(s => ({ 
        id: s._id, 
        month: s.month, 
        netSalary: s.netSalary, 
        paymentStatus: s.paymentStatus 
      }))
    });

    res.json({ totalAmount, count: slips.length });
  } catch (err) {
    console.error('❌ Backend error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/salary-slip/:id - Get salary slip by ID (ObjectId) or generate by employee ID
router.get('/:id', handleGetRequest);

export default router;
