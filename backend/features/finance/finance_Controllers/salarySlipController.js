import EmployeeSalarySlip from '../finance_Model/EmployeeSalarySlip.js';
import Allowance from '../finance_Model/AllowanceModel.js';
import mongoose from 'mongoose';

// Configuration for data source (mock vs database)
const USE_MOCK_DATA = false; // Changed to false to use real database

// Direct access to the payrolls collection
const getPayrollCollection = () => {
  return mongoose.connection.db.collection('payrolls');
};

// Mock payroll data (for testing/development)
const getMockPayrollData = () => {
  const payrollRecords = [
    {
      employeeId: 'EMP001',
      employeeName: 'John Anderson',
      month: '2025-10',
      basicSalary: 75000,
      overtimeAmount: 12500,
      noPayDeductionAmount: 2500
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Mitchell',
      month: '2025-10',
      basicSalary: 85000,
      overtimeAmount: 15000,
      noPayDeductionAmount: 3000
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Michael Chen',
      month: '2025-10',
      basicSalary: 65000,
      overtimeAmount: 8000,
      noPayDeductionAmount: 1500
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Emma Thompson',
      month: '2025-10',
      basicSalary: 95000,
      overtimeAmount: 18000,
      noPayDeductionAmount: 4000
    },
    {
      employeeId: 'EMP005',
      employeeName: 'Robert Wilson',
      month: '2025-10',
      basicSalary: 70000,
      overtimeAmount: 10000,
      noPayDeductionAmount: 2000
    },
    {
      employeeId: 'EMP006',
      employeeName: 'Robbin Kate',
      month: '2025-10',
      basicSalary: 90000,
      overtimeAmount: 10000,
      noPayDeductionAmount: 7000
    },
    {
      employeeId: 'EMP001',
      employeeName: 'John Anderson',
      month: '2025-09',
      basicSalary: 75000,
      overtimeAmount: 1500,
      noPayDeductionAmount: 3500
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Sarah Mitchell',
      month: '2025-09',
      basicSalary: 85000,
      overtimeAmount: 17000,
      noPayDeductionAmount: 8000
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Michael Chen',
      month: '2025-09',
      basicSalary: 65000,
      overtimeAmount: 2000,
      noPayDeductionAmount: 1900
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Emma Thompson',
      month: '2025-09',
      basicSalary: 95000,
      overtimeAmount: 1000,
      noPayDeductionAmount: 7000
    },
    {
      employeeId: 'EMP005',
      employeeName: 'Robert Wilson',
      month: '2025-09',
      basicSalary: 70000,
      overtimeAmount: 1000,
      noPayDeductionAmount: 2800
    },
    {
      employeeId: 'EMP006',
      employeeName: 'Robbin Kate',
      month: '2025-09',
      basicSalary: 40000,
      overtimeAmount: 10000,
      noPayDeductionAmount: 6000
    }
  ];
  
  return payrollRecords;
};

// Scalable function to get all payroll records (works with mock or database)
const getAllPayrollRecords = async () => {
  if (USE_MOCK_DATA) {
    // Use mock data for testing/development
    return getMockPayrollData();
  } else {
    // Use real database - fetch from payrolls collection
    try {
      const payrollCollection = getPayrollCollection();
      const payrollRecords = await payrollCollection.find({}).toArray();
      
      // Transform the data to match the expected format
      const transformedRecords = payrollRecords.map(record => ({
        _id: record._id, // Keep the MongoDB ObjectId
        employeeId: record.employeeIdDisplay, // Use employeeIdDisplay field
        employeeName: record.employeeName,
        month: record.month,
        basicSalary: record.basicSalary,
        overtimeAmount: record.overtimeAmount,
        noPayDeductionAmount: record.noPayDeductionAmount,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }));
      
      console.log(`📊 Fetched ${transformedRecords.length} payroll records from database`);
      return transformedRecords;
    } catch (error) {
      console.error('Error fetching payroll records from database:', error);
      console.warn('Falling back to mock data');
      return getMockPayrollData();
    }
  }
};

// Scalable function to get payroll data for specific employee and month
const getPayrollRecordForEmployee = async (employeeId, month) => {
  if (USE_MOCK_DATA) {
    // Use mock data for testing/development
    const allPayrollData = getMockPayrollData();
    const payrollData = allPayrollData.find(record => 
      record.employeeId === employeeId && record.month === month
    );
    
    if (!payrollData) {
      throw new Error(`Employee ${employeeId} not found for month ${month} in payroll records`);
    }
    
    return payrollData;
  } else {
    // Use real database - fetch from payrolls collection
    try {
      const payrollCollection = getPayrollCollection();
      const payrollRecord = await payrollCollection.findOne({ 
        employeeIdDisplay: employeeId, // Use employeeIdDisplay field for matching
        month: month
      });
      
      if (!payrollRecord) {
        throw new Error(`Employee ${employeeId} not found for month ${month} in payroll records`);
      }
      
      // Transform the data to match the expected format
      const transformedRecord = {
        _id: payrollRecord._id,
        employeeId: payrollRecord.employeeIdDisplay,
        employeeName: payrollRecord.employeeName,
        month: payrollRecord.month,
        basicSalary: payrollRecord.basicSalary,
        overtimeAmount: payrollRecord.overtimeAmount,
        noPayDeductionAmount: payrollRecord.noPayDeductionAmount,
        createdAt: payrollRecord.createdAt,
        updatedAt: payrollRecord.updatedAt
      };
      
      return transformedRecord;
    } catch (error) {
      console.error('Error fetching payroll record from database:', error);
      console.warn('Falling back to mock data');
      
      // Fallback to mock data
      const allPayrollData = getMockPayrollData();
      const payrollData = allPayrollData.find(record => 
        record.employeeId === employeeId && record.month === month
      );
      
      if (!payrollData) {
        throw new Error(`Employee ${employeeId} not found for month ${month} in payroll records`);
      }
      
      return payrollData;
    }
  }
};

// Scalable function to get available employees (works with mock or database)
const getAvailableEmployeesData = async () => {
  if (USE_MOCK_DATA) {
    // Use mock data for testing/development
    const employees = [
      { employeeId: 'EMP001', employeeName: 'John Anderson' },
      { employeeId: 'EMP002', employeeName: 'Sarah Mitchell' },
      { employeeId: 'EMP003', employeeName: 'Michael Chen' },
      { employeeId: 'EMP004', employeeName: 'Emma Thompson' },
      { employeeId: 'EMP005', employeeName: 'Robert Wilson' }
    ];
    return employees;
  } else {
    // Use real database - fetch from payrolls collection
    try {
      const payrollCollection = getPayrollCollection();
      const payrollRecords = await payrollCollection.find({}).toArray();
      
      // Extract unique employees
      const employees = payrollRecords.map(record => ({
        employeeId: record.employeeIdDisplay, // Use employeeIdDisplay field
        employeeName: record.employeeName
      }));

      // Remove duplicates
      const uniqueEmployees = employees.filter((employee, index, self) => 
        index === self.findIndex(e => e.employeeId === employee.employeeId)
      );

      console.log(`👥 Found ${uniqueEmployees.length} unique employees from database`);
      return uniqueEmployees;
    } catch (error) {
      console.error('Error fetching employees from database:', error);
      console.warn('Falling back to mock data');
      
      // Fallback to mock data
      const employees = [
        { employeeId: 'EMP001', employeeName: 'John Anderson' },
        { employeeId: 'EMP002', employeeName: 'Sarah Mitchell' },
        { employeeId: 'EMP003', employeeName: 'Michael Chen' },
        { employeeId: 'EMP004', employeeName: 'Emma Thompson' },
        { employeeId: 'EMP005', employeeName: 'Robert Wilson' }
      ];
      return employees;
    }
  }
};

// Generate salary slip for a specific employee and month
const generateSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month } = req.query;

    // Validate required parameters
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required (format: YYYY-MM)" });
    }

    // Check if salary slip already exists for this employee and month
    const existingSlip = await EmployeeSalarySlip.findOne({ 
      employeeId, 
      month 
    });

    if (existingSlip) {
      return res.status(200).json(existingSlip);
    }

    // Get payroll data for the employee (scalable - works with mock or database)
    const payrollData = await getPayrollRecordForEmployee(employeeId, month);

    // Fetch allowances for the employee and month
    const allowances = await Allowance.find({ 
      employeeId, 
      month 
    });

    // Calculate total allowances
    const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

    // Calculate EPF and ETF contributions
    const epfEmployeeContribution = Math.round(payrollData.basicSalary * 0.08);
    const epfEmployerContribution = Math.round(payrollData.basicSalary * 0.12);
    const etfEmployerContribution = Math.round(payrollData.basicSalary * 0.03);

    // Calculate gross salary
    const grossSalary = payrollData.basicSalary + payrollData.overtimeAmount + totalAllowances;

    // Calculate total deductions
    const totalDeductions = payrollData.noPayDeductionAmount + epfEmployeeContribution;

    // Calculate net salary
    const netSalary = grossSalary - totalDeductions;

    // Generate unique salary slip ID (include month from request)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthFromRequest = month.replace('-', '');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const salarySlipId = `SLIP${year}-${employeeId}-${monthFromRequest}${day}`;

    // Create salary slip record
    const salarySlip = await EmployeeSalarySlip.create({
      salarySlipId,
      employeeId,
      month,
      basicSalary: payrollData.basicSalary,
      otAmount: payrollData.overtimeAmount,
      totalAllowances,
      totalDeductions,
      epfEmployeeContribution,
      epfEmployerContribution,
      etfEmployerContribution,
      grossSalary,
      netSalary,
      paymentStatus: 'Pending',
      createdBy: null
    });

    return res.status(201).json(salarySlip);

  } catch (error) {
    console.error("Error generating salary slip:", error);
    return res.status(500).json({ 
      message: "Server error while generating salary slip",
      error: error.message 
    });
  }
};

// Get salary slip by ID
const getSalarySlipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salarySlip = await EmployeeSalarySlip.findById(id);
    
    if (!salarySlip) {
      return res.status(404).json({ message: "Salary slip not found" });
    }

    return res.status(200).json(salarySlip);
  } catch (error) {
    console.error("Error fetching salary slip:", error);
    return res.status(500).json({ 
      message: "Server error while fetching salary slip",
      error: error.message 
    });
  }
};

// Get all salary slips with optional filters
const getAllSalarySlips = async (req, res) => {
  try {
    const { employeeId, month, paymentStatus } = req.query;
    const filter = {};

    // Handle employee ID filter with partial matching (case-insensitive)
    if (employeeId) {
      filter.employeeId = {
        $regex: employeeId,
        $options: 'i' // Case-insensitive
      };
    }

    // Handle month filter with partial matching (case-insensitive)
    if (month) {
      filter.month = {
        $regex: month,
        $options: 'i' // Case-insensitive
      };
    }

    // Handle payment status filter (exact match)
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const salarySlips = await EmployeeSalarySlip.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(salarySlips);
  } catch (error) {
    console.error("Error fetching salary slips:", error);
    return res.status(500).json({ message: "Server error while fetching salary slips" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Pending', 'Paid', 'Unpaid'].includes(paymentStatus)) {
      return res.status(400).json({ 
        message: "Valid payment status is required (Pending, Paid, Unpaid)" 
      });
    }

    const updatedSlip = await EmployeeSalarySlip.findByIdAndUpdate(
      id, 
      { paymentStatus }, 
      { new: true }
    );

    if (!updatedSlip) {
      return res.status(404).json({ message: "Salary slip not found" });
    }

    return res.status(200).json(updatedSlip);
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Server error while updating payment status" });
  }
};

// Get all available employees from mock payroll data
const getAvailableEmployees = async (req, res) => {
  try {
    // Get available employees (scalable - works with mock or database)
    const employees = await getAvailableEmployeesData();

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching available employees:", error);
    return res.status(500).json({ message: "Server error while fetching employees" });
  }
};

// Generate salary slips for all payroll records (no month parameter needed)
const generateAllSalarySlips = async (req, res) => {
  try {
    // Get all payroll records (scalable - works with mock or database)
    const allPayrollRecords = await getAllPayrollRecords();

    const results = {
      totalProcessed: 0,
      created: 0,
      skipped: 0,
      errors: [],
      generatedSlips: []
    };

    // Process each payroll record
    for (const payrollRecord of allPayrollRecords) {
      try {
        results.totalProcessed++;

        // Check if salary slip already exists for this employee and month
        const existingSlip = await EmployeeSalarySlip.findOne({ 
          employeeId: payrollRecord.employeeId, 
          month: payrollRecord.month 
        });

        if (existingSlip) {
          results.skipped++;
          results.generatedSlips.push({
            employeeId: payrollRecord.employeeId,
            employeeName: payrollRecord.employeeName,
            month: payrollRecord.month,
            status: 'skipped',
            reason: 'Already exists',
            salarySlipId: existingSlip.salarySlipId
          });
          continue;
        }

        // Fetch allowances for the employee and month
        const allowances = await Allowance.find({ 
          employeeId: payrollRecord.employeeId, 
          month: payrollRecord.month 
        });

        // Calculate total allowances
        const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

        // Calculate EPF and ETF contributions
        const epfEmployeeContribution = Math.round(payrollRecord.basicSalary * 0.08);
        const epfEmployerContribution = Math.round(payrollRecord.basicSalary * 0.12);
        const etfEmployerContribution = Math.round(payrollRecord.basicSalary * 0.03);

        // Calculate gross salary
        const grossSalary = payrollRecord.basicSalary + payrollRecord.overtimeAmount + totalAllowances;

        // Calculate total deductions
        const totalDeductions = payrollRecord.noPayDeductionAmount + epfEmployeeContribution;

        // Calculate net salary
        const netSalary = grossSalary - totalDeductions;

        // Generate unique salary slip ID (include month from payroll record)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const monthFromRecord = payrollRecord.month.replace('-', '');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const salarySlipId = `SLIP${year}-${payrollRecord.employeeId}-${monthFromRecord}${day}`;

        // Create salary slip record
        const salarySlip = await EmployeeSalarySlip.create({
          salarySlipId,
          employeeId: payrollRecord.employeeId,
          month: payrollRecord.month,
          basicSalary: payrollRecord.basicSalary,
          otAmount: payrollRecord.overtimeAmount,
          totalAllowances,
          totalDeductions,
          epfEmployeeContribution,
          epfEmployerContribution,
          etfEmployerContribution,
          grossSalary,
          netSalary,
          paymentStatus: 'Pending',
          createdBy: null
        });

        results.created++;
        results.generatedSlips.push({
          employeeId: payrollRecord.employeeId,
          employeeName: payrollRecord.employeeName,
          month: payrollRecord.month,
          status: 'created',
          salarySlipId: salarySlip.salarySlipId,
          grossSalary,
          netSalary
        });

      } catch (error) {
        results.errors.push({
          employeeId: payrollRecord.employeeId,
          month: payrollRecord.month,
          error: error.message
        });
        console.error(`Error generating salary slip for ${payrollRecord.employeeId} (${payrollRecord.month}):`, error);
      }
    }

    return res.status(200).json({
      message: `Bulk salary slip generation completed for all payroll records`,
      results: {
        ...results,
        payrollRecordsTotal: allPayrollRecords.length,
        months: [...new Set(allPayrollRecords.map(r => r.month))].sort(),
        employees: [...new Set(allPayrollRecords.map(r => r.employeeId))].sort()
      }
    });

  } catch (error) {
    console.error("Error in bulk salary slip generation:", error);
    return res.status(500).json({ 
      message: "Server error while generating bulk salary slips",
      error: error.message 
    });
  }
};

// ==================== AUTOMATIC SALARY SLIP GENERATION ====================

/**
 * Automatically generates a salary slip for a single payroll record
 * This function is called whenever a new payroll record is created
 * @param {Object} payrollRecord - The payroll record to generate salary slip for
 * @returns {Object} - Result of the generation process
 */
const autoGenerateSalarySlipForPayroll = async (payrollRecord) => {
  try {
    const { employeeId, employeeName, month, basicSalary, overtimeAmount, noPayDeductionAmount } = payrollRecord;

    console.log(`🔄 Auto-generating salary slip for ${employeeName} (${employeeId}) - ${month}`);

    // Check if salary slip already exists (duplicate prevention)
    const existingSlip = await EmployeeSalarySlip.findOne({
      employeeId: employeeId,
      month: month
    });

    if (existingSlip) {
      console.log(`⏭️  Salary slip already exists for ${employeeName} (${employeeId}) - ${month}. Skipping auto-generation.`);
      return {
        success: false,
        message: `Salary slip already exists for employee ${employeeId} for month ${month}`,
        action: 'skipped',
        existingSalarySlipId: existingSlip.salarySlipId
      };
    }

    // Additional check: Look for any existing salary slip with the same employee name and month
    // This prevents duplicates even if employee IDs are formatted differently
    const existingByName = await EmployeeSalarySlip.findOne({
      $and: [
        { month: month },
        {
          $or: [
            { employeeId: employeeId },
            { employeeId: employeeId.replace('EMP000', 'EMP00') }, // Check both formats
            { employeeId: employeeId.replace('EMP00', 'EMP000') }
          ]
        }
      ]
    });

    if (existingByName && existingByName.employeeId !== employeeId) {
      console.log(`⏭️  Salary slip already exists for ${employeeName} with different ID format (${existingByName.employeeId}) - ${month}. Skipping auto-generation.`);
      return {
        success: false,
        message: `Salary slip already exists for employee ${employeeName} for month ${month} with different ID format`,
        action: 'skipped',
        existingSalarySlipId: existingByName.salarySlipId
      };
    }

    // Get allowances for this employee
    const allowances = await Allowance.find({ employeeId: employeeId });
    const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

    // Calculate EPF and ETF contributions
    const epfEmployeeContribution = Math.round(basicSalary * 0.08);
    const epfEmployerContribution = Math.round(basicSalary * 0.12);
    const etfEmployerContribution = Math.round(basicSalary * 0.03);

    // Calculate gross salary (basic + overtime + allowances)
    const grossSalary = basicSalary + overtimeAmount + totalAllowances;

    // Calculate total deductions
    const totalDeductions = noPayDeductionAmount + epfEmployeeContribution;

    // Calculate net salary (gross - total deductions)
    const netSalary = grossSalary - totalDeductions;

    // Generate unique salary slip ID
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthForId = month.replace('-', '');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const salarySlipId = `SLIP${year}-${employeeId}-${monthForId}${day}`;

    // Create new salary slip with CORRECT field names matching the schema
    const newSalarySlip = new EmployeeSalarySlip({
      salarySlipId: salarySlipId,
      employeeId: employeeId,
      month: month,
      basicSalary: basicSalary,
      otAmount: overtimeAmount,
      totalAllowances: totalAllowances,
      totalDeductions: totalDeductions,
      epfEmployeeContribution: epfEmployeeContribution,
      epfEmployerContribution: epfEmployerContribution,
      etfEmployerContribution: etfEmployerContribution,
      grossSalary: grossSalary,
      netSalary: netSalary,
      paymentStatus: 'Pending',
      createdBy: 'System Auto-Generation'
    });

    const savedSalarySlip = await newSalarySlip.save();

    console.log(`✅ Auto-generated salary slip for ${employeeName} (${employeeId}) - ${month}. ID: ${salarySlipId}`);

    return {
      success: true,
      message: `Salary slip auto-generated successfully for ${employeeName}`,
      action: 'created',
      salarySlipId: salarySlipId,
      employeeId: employeeId,
      employeeName: employeeName,
      month: month,
      grossSalary: grossSalary,
      netSalary: netSalary
    };

  } catch (error) {
    console.error(`❌ Error auto-generating salary slip for ${payrollRecord.employeeName}:`, error);
    return {
      success: false,
      message: `Failed to auto-generate salary slip: ${error.message}`,
      action: 'error',
      error: error.message
    };
  }
};

/**
 * Middleware function to automatically generate salary slips for new payroll records
 * This can be called from payroll creation endpoints
 * @param {Array|Object} payrollData - Single payroll record or array of payroll records
 * @returns {Object} - Results of auto-generation
 */
const autoGenerateSalarySlipsForPayroll = async (payrollData) => {
  try {
    // Handle both single record and array of records
    const payrollRecords = Array.isArray(payrollData) ? payrollData : [payrollData];
    
    console.log(`🚀 Starting auto-generation for ${payrollRecords.length} payroll record(s)`);

    const results = {
      totalProcessed: payrollRecords.length,
      created: 0,
      skipped: 0,
      errors: [],
      generatedSlips: []
    };

    // Process each payroll record
    for (const payrollRecord of payrollRecords) {
      const result = await autoGenerateSalarySlipForPayroll(payrollRecord);
      
      if (result.success && result.action === 'created') {
        results.created++;
        results.generatedSlips.push({
          employeeId: result.employeeId,
          employeeName: result.employeeName,
          month: result.month,
          status: result.action,
          salarySlipId: result.salarySlipId,
          grossSalary: result.grossSalary,
          netSalary: result.netSalary
        });
      } else if (result.action === 'skipped') {
        results.skipped++;
      } else if (result.action === 'error') {
        results.errors.push({
          employeeId: payrollRecord.employeeId,
          employeeName: payrollRecord.employeeName,
          month: payrollRecord.month,
          error: result.message
        });
      }
    }

    console.log(`✅ Auto-generation completed: ${results.created} created, ${results.skipped} skipped, ${results.errors.length} errors`);

    return {
      success: true,
      message: `Auto-generation completed for ${payrollRecords.length} payroll record(s)`,
      results: results
    };

  } catch (error) {
    console.error('❌ Error in auto-generation process:', error);
    return {
      success: false,
      message: `Auto-generation failed: ${error.message}`,
      error: error.message
    };
  }
};

export { 
  generateSalarySlip, 
  getSalarySlipById, 
  getAllSalarySlips, 
  updatePaymentStatus,
  getAvailableEmployees,
  generateAllSalarySlips,
  autoGenerateSalarySlipForPayroll,
  autoGenerateSalarySlipsForPayroll,
  getMockPayrollData,
  getAllPayrollRecords,
  getPayrollRecordForEmployee
};