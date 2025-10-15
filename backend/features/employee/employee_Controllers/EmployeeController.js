import Employee from '../employee_Model/EmployeeModel.js';
import mongoose from 'mongoose';

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    console.log('📋 Fetching all active employees');
    const employees = await Employee.find({ status: 'Active' }).lean().exec();
    console.log(`✅ Found ${employees.length} active employees`);
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('❌ Error fetching employees:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { employee_id } = req.params;
    
    console.log(`🔍 Looking for employee: ${employee_id}`);
    
    // Validate employee ID format
    if (!/^EMP\d{4}$/.test(employee_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format. Must be EMP followed by 4 digits (e.g., EMP0001)'
      });
    }

    // Check MongoDB connection state
    if (mongoose.connection.readyState !== 1) {
      console.log(`⚠️ MongoDB not ready, connection state: ${mongoose.connection.readyState}`);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please try again in a moment.',
        error: 'MongoDB connection not ready'
      });
    }

    // Use timeout and lean query to prevent buffering issues
    const employee = await Promise.race([
      Employee.findOne({ employee_id, status: 'Active' }).lean().exec(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
      )
    ]);
    
    if (!employee) {
      console.log(`❌ Employee ${employee_id} not found in database`);
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    console.log(`✅ Employee found: ${employee.name} (${employee.role})`);
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error(`❌ Error fetching employee ${req.params.employee_id}:`, error.message);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Error fetching employee';
    if (error.message.includes('buffering timed out')) {
      errorMessage = 'Database query timeout. Please try again.';
    } else if (error.message.includes('Query timeout')) {
      errorMessage = 'Employee lookup timeout. Please try again.';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Database connection error. Please try again.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ employee_id: employeeData.employee_id });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    const newEmployee = new Employee(employeeData);
    const savedEmployee = await newEmployee.save();
    
    res.status(201).json({
      success: true,
      data: savedEmployee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const updateData = req.body;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employee_id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

// Delete employee (soft delete by setting status to Inactive)
export const deleteEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employee_id },
      { status: 'Inactive' },
      { new: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};