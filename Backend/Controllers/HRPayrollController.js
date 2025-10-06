import Payroll from '../Models/HRPayrollModel.js';
import Attendance from '../Models/HRAttendanceModel.js';
import Employee from '../Models/HREmployeeModel.js';

// 💡 Fixed reference values (hardcoded)
const MONTHLY_SALARY = 75000;
const PER_DAY_RATE = 2500;
const HOURLY_OT_RATE = 500;

// 🚀 Generate payroll record for an employee in a given month
export const generatePayrollForEmployee = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    // Validate input
    if (!employeeId || !month) {
      return res.status(400).json({
        success: false,
        message: 'employeeId and month are required'
      });
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in format YYYY-MM (e.g., "2025-10")'
      });
    }

    // Check if payroll already exists for this employee and month
    const existingPayroll = await Payroll.findOne({ 
      employeeId: employeeId, 
      month: month 
    });

    if (existingPayroll) {
      return res.status(200).json({
        success: true,
        message: `Payroll already exists for employee ${employeeId} for ${month}`,
        data: existingPayroll,
        skipped: true
      });
    }

    // Fetch employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Fetch attendance record for the employee and month
    const attendance = await Attendance.findOne({
      employee_id: employee.employee_id,
      month: month
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: `Attendance record not found for employee ${employee.name} for ${month}`
      });
    }

    // 🧮 Calculations
    const basicSalary = attendance.working_days * PER_DAY_RATE;
    const overtimeAmount = attendance.ot_hours * HOURLY_OT_RATE;
    const noPayDeductionAmount = attendance.no_pay_leave_count * PER_DAY_RATE;

    // Create new payroll record
    const newPayroll = new Payroll({
      employeeId: employee._id,
      employeeName: employee.name,
      month: month,
      basicSalary: basicSalary,
      overtimeAmount: overtimeAmount,
      noPayDeductionAmount: noPayDeductionAmount
    });

    const savedPayroll = await newPayroll.save();

    res.status(201).json({
      success: true,
      message: `Payroll generated successfully for ${employee.name} for ${month}`,
      data: savedPayroll
    });

  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating payroll',
      error: error.message
    });
  }
};

// 🚀 Generate payroll for multiple employees in batch
export const generatePayrollBatch = async (req, res) => {
  try {
    const { month, employeeIds } = req.body;

    // Validate input
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'month is required'
      });
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in format YYYY-MM (e.g., "2025-10")'
      });
    }

    let targetEmployees;
    
    // If specific employee IDs provided, use those, otherwise get all active employees
    if (employeeIds && employeeIds.length > 0) {
      targetEmployees = await Employee.find({ 
        _id: { $in: employeeIds },
        status: 'Active'
      });
    } else {
      targetEmployees = await Employee.find({ status: 'Active' });
    }

    if (targetEmployees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active employees found'
      });
    }

    const results = {
      generated: [],
      skipped: [],
      errors: []
    };

    for (const employee of targetEmployees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await Payroll.findOne({ 
          employeeId: employee._id, 
          month: month 
        });

        if (existingPayroll) {
          results.skipped.push({
            employeeId: employee._id,
            employeeName: employee.name,
            message: `Payroll already exists for ${month}`
          });
          continue;
        }

        // Fetch attendance record
        const attendance = await Attendance.findOne({
          employee_id: employee.employee_id,
          month: month
        });

        if (!attendance) {
          results.errors.push({
            employeeId: employee._id,
            employeeName: employee.name,
            message: `Attendance record not found for ${month}`
          });
          continue;
        }

        // Calculate payroll
        const basicSalary = attendance.working_days * PER_DAY_RATE;
        const overtimeAmount = attendance.ot_hours * HOURLY_OT_RATE;
        const noPayDeductionAmount = attendance.no_pay_leave_count * PER_DAY_RATE;

        // Create payroll record
        const newPayroll = new Payroll({
          employeeId: employee._id,
          employeeName: employee.name,
          month: month,
          basicSalary: basicSalary,
          overtimeAmount: overtimeAmount,
          noPayDeductionAmount: noPayDeductionAmount
        });

        const savedPayroll = await newPayroll.save();
        results.generated.push(savedPayroll);

      } catch (error) {
        results.errors.push({
          employeeId: employee._id,
          employeeName: employee.name,
          message: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Batch payroll generation completed for ${month}`,
      summary: {
        total: targetEmployees.length,
        generated: results.generated.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      },
      data: results
    });

  } catch (error) {
    console.error('Error in batch payroll generation:', error);
    res.status(500).json({
      success: false,
      message: 'Error in batch payroll generation',
      error: error.message
    });
  }
};

// Get all payroll records with optional filtering
export const getPayrolls = async (req, res) => {
  try {
    const { month, employeeId, page = 1, limit = 50 } = req.query;
    
    // Build filter object
    const filter = {};
    if (month) filter.month = month;
    if (employeeId) filter.employeeId = employeeId;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get payroll records with pagination
    const payrolls = await Payroll.find(filter)
      .populate('employeeId', 'name employeeId department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Payroll.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: payrolls,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total
      },
      count: payrolls.length
    });

  } catch (error) {
    console.error('Error fetching payrolls:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll records',
      error: error.message
    });
  }
};

// Get specific payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payroll = await Payroll.findById(id)
      .populate('employeeId', 'name employeeId department email');

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });

  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll record',
      error: error.message
    });
  }
};

// Delete payroll record
export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPayroll = await Payroll.findByIdAndDelete(id);

    if (!deletedPayroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payroll record deleted successfully',
      data: deletedPayroll
    });

  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting payroll record',
      error: error.message
    });
  }
};