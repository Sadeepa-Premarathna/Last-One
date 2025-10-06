import Employee from '../Models/HREmployeeModel.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import FallbackService from '../Services/FallbackService.js';

// Comprehensive validation schema for employee creation
const createEmployeeSchema = Joi.object({
  employee_id: Joi.string()
    .pattern(/^EMP\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Employee ID must start with "EMP" followed by exactly 4 digits (e.g., EMP0001)',
      'any.required': 'Employee ID is required'
    }),

  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Name must contain only letters and spaces',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  NIC: Joi.string()
    .pattern(/^\d{10}$/)
    .custom((value, helpers) => {
      // Check age based on first 4 digits of NIC
      const birthYear = parseInt(value.substring(0, 4));
      const currentYear = new Date().getFullYear();
      const minAge = 18;
      
      if (birthYear > currentYear - minAge) {
        return helpers.error('any.invalid', { message: 'Employee must be at least 18 years old based on NIC' });
      }
      return value;
    })
    .required()
    .messages({
      'string.pattern.base': 'NIC must be exactly 10 digits (e.g., 1985123456)',
      'any.required': 'NIC is required',
      'any.invalid': 'Employee must be at least 18 years old based on NIC'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits',
      'any.required': 'Phone number is required'
    }),

  role: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Role must be at least 2 characters',
      'string.max': 'Role cannot exceed 100 characters',
      'any.required': 'Role is required'
    }),

  department: Joi.string()
    .valid('HR', 'Finance', 'Manufacturing', 'Sales', 'Distribution')
    .required()
    .messages({
      'any.only': 'Department must be one of: HR, Finance, Manufacturing, Sales, Distribution',
      'any.required': 'Department is required'
    }),

  status: Joi.string()
    .valid('Active', 'Resigned', 'On Probation', 'On Leave')
    .default('Active')
    .messages({
      'any.only': 'Status must be one of: Active, Resigned, On Probation, On Leave'
    }),

  date_of_birth: Joi.date()
    .max('now')
    .custom((value, helpers) => {
      // Check if employee is at least 18 years old
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        actualAge = age - 1;
      }
      
      if (actualAge < 18) {
        return helpers.error('any.invalid', { message: 'Employee must be at least 18 years old' });
      }
      return value;
    })
    .required()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'any.required': 'Date of birth is required',
      'any.invalid': 'Employee must be at least 18 years old'
    }),

  join_date: Joi.date()
    .max('now')
    .custom((value, helpers) => {
      const { date_of_birth } = helpers.state.ancestors[0];
      if (!date_of_birth) return value;
      
      // Check if join date is at least 18 years after birth date
      const birthDate = new Date(date_of_birth);
      const joinDate = new Date(value);
      const yearDiff = joinDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = joinDate.getMonth() - birthDate.getMonth();
      const dayDiff = joinDate.getDate() - birthDate.getDate();
      
      let actualYearDiff = yearDiff;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualYearDiff = yearDiff - 1;
      }
      
      if (actualYearDiff < 18) {
        return helpers.error('any.invalid', { message: 'Join date must be at least 18 years after date of birth' });
      }
      return value;
    })
    .required()
    .messages({
      'date.max': 'Join date cannot be in the future',
      'any.required': 'Join date is required',
      'any.invalid': 'Join date must be at least 18 years after date of birth'
    }),

  basic_salary: Joi.number()
    .positive()
    .min(1000)
    .max(10000000)
    .required()
    .messages({
      'number.positive': 'Salary must be a positive number',
      'number.min': 'Salary must be at least 1000',
      'number.max': 'Salary cannot exceed 10,000,000',
      'any.required': 'Basic salary is required'
    }),

  address: Joi.string()
    .max(200)
    .allow('')
    .messages({
      'string.max': 'Address cannot exceed 200 characters'
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .required()
    .messages({
      'any.only': 'Gender must be one of: Male, Female, Other',
      'any.required': 'Gender is required'
    })
});

// Validation schema for employee updates (all fields optional except ID)
const updateEmployeeSchema = createEmployeeSchema.fork(
  ['employee_id', 'name', 'NIC', 'email', 'phone', 'role', 'date_of_birth', 'basic_salary', 'status', 'department', 'join_date'],
  (schema) => schema.optional()
);

// Helper function to check uniqueness
const checkUniqueness = async (field, value, excludeId = null) => {
  const query = { [field]: value };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  if (!global.usingDatabase) {
    // Fallback mode checks
    const employees = await FallbackService.getAllEmployees();
    return employees.some(emp => 
      emp[field] === value && (!excludeId || emp._id !== excludeId)
    );
  } else {
    // MongoDB mode checks
    const existing = await Employee.findOne(query);
    return !!existing;
  }
};

// Validation middleware
const validateEmployee = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors 
        });
      }
      
      req.validatedBody = value;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Validation error', error: err.message });
    }
  };
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    // Check if using database or fallback
    if (!global.usingDatabase) {
      const employees = await FallbackService.getAllEmployees();
      const { name, role, department, status } = req.query;
      
      // Apply filters to fallback data
      let filteredEmployees = employees;
      if (name) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (role) {
        filteredEmployees = filteredEmployees.filter(emp => emp.role === role);
      }
      if (department) {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
      }
      if (status) {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === status);
      }

      // Sort by creation date (newest first)
      filteredEmployees.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB - dateA;
      });

      // Transform fallback employees to match frontend expectations
      const transformedEmployees = filteredEmployees.map(emp => ({
        id: emp.id || emp._id,
        employee_id: emp.employee_id,
        name: emp.name,
        NIC: emp.NIC,
        role: emp.role,
        department: emp.department,
        status: emp.status,
        date_of_birth: emp.date_of_birth,
        join_date: emp.join_date,
        basic_salary: emp.basic_salary || emp.salary,
        phone: emp.phone,
        email: emp.email,
        address: emp.address,
        gender: emp.gender
      }));

      console.log(`📊 Retrieved ${transformedEmployees.length} employees from JSON fallback`);
      return res.status(200).json(transformedEmployees);
    }

    // Original MongoDB logic
    const { name, role, department, status } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    
    // Transform employees to match frontend expectations
    const transformedEmployees = employees.map(emp => ({
      id: emp._id.toString(),
      employee_id: emp.employee_id,
      name: emp.name,
      NIC: emp.NIC,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      date_of_birth: emp.date_of_birth,
      join_date: emp.join_date,
      basic_salary: emp.basic_salary,
      phone: emp.phone,
      email: emp.email,
      address: emp.address,
      gender: emp.gender
    }));
    
    console.log(`📊 Retrieved ${transformedEmployees.length} employees from MongoDB`);
    return res.status(200).json(transformedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Server error while fetching employee' });
  }
};

// Create employee with comprehensive validation
export const createEmployee = async (req, res) => {
  try {
    console.log('📝 Incoming payload:', JSON.stringify(req.body, null, 2));
    
    // Validate request body using Joi schema
    const { error, value } = createEmployeeSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.log('❌ Joi validation errors:', error.details);
      const errors = {};
      error.details.forEach(detail => {
        const field = detail.path.join('.');
        errors[field] = detail.message;
      });
      console.log('🔄 Formatted errors:', errors);
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }

    const {
      employee_id, name, NIC, email, phone, role,
      date_of_birth, basic_salary, status,
      department, join_date, address, gender
    } = value;

    // Check uniqueness for employee_id, NIC, and email
    const validationErrors = {};
    
    const employeeIdExists = await checkUniqueness('employee_id', employee_id);
    if (employeeIdExists) {
      validationErrors.employee_id = 'Employee ID already exists';
    }

    const nicExists = await checkUniqueness('NIC', NIC);
    if (nicExists) {
      validationErrors.NIC = 'NIC already exists';
    }

    const emailExists = await checkUniqueness('email', email);
    if (emailExists) {
      validationErrors.email = 'Email already exists';
    }

    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Additional validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false,
        errors: validationErrors 
      });
    }

    // Create employee record
    let employee;
    
    if (!global.usingDatabase) {
      // Fallback mode
      const employeeData = {
        employee_id, 
        name, 
        NIC, 
        email, 
        phone, 
        role,
        date_of_birth,
        salary: Number(basic_salary),
        basic_salary: Number(basic_salary),
        status, 
        department,
        join_date,
        address: address || '',
        gender: gender || undefined,
        epfEligible: true,
        etfEligible: true
      };
      
      employee = await FallbackService.createEmployee(employeeData);
      console.log(`🎉 SUCCESS: Employee created in JSON fallback: ${name} (ID: ${employee_id})`);
    } else {
      // MongoDB mode
      employee = await Employee.create({
        employee_id, 
        name, 
        NIC, 
        email, 
        phone, 
        role,
        date_of_birth: new Date(date_of_birth),
        basic_salary: Number(basic_salary),
        status, 
        department,
        join_date: new Date(join_date),
        address: address || '',
        gender: gender || undefined,
        createdAt: new Date()
      });
      console.log(`🎉 SUCCESS: Employee created in MongoDB: ${name} (ID: ${employee_id})`);
    }

    console.log(`📦 Created employee:`, employee);
    
    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: employee
    });
  } catch (error) {
    console.error('💥 Error creating employee:', error);
    
    if (error.code === 11000) {
      // Handle MongoDB duplicate key errors
      const field = Object.keys(error.keyPattern)[0];
      const friendlyFieldNames = {
        'employee_id': 'employee_id',
        'NIC': 'NIC',
        'email': 'email'
      };
      const errors = {};
      errors[friendlyFieldNames[field] || field] = `${friendlyFieldNames[field] || field} already exists`;
      
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Server error while creating employee' 
    });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Validate status enum if provided
    if (updates.status) {
      const validStatuses = ['Active', 'Inactive', 'Resigned', 'Terminated'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ message: 'Invalid status. Must be one of: Active, Inactive, Resigned, Terminated' });
      }
    }

    // Validate gender enum if provided
    if (updates.gender && !['Male', 'Female', 'Other'].includes(updates.gender)) {
      return res.status(400).json({ message: 'Invalid gender. Must be one of: Male, Female, Other' });
    }

    // Validate basic_salary if provided
    if (updates.basic_salary != null && updates.basic_salary <= 0) {
      return res.status(400).json({ message: 'Basic salary must be greater than 0' });
    }

    // Guard: NIC uniqueness if changed
    if (updates.NIC) {
      const exists = await Employee.findOne({ NIC: updates.NIC, employee_id: { $ne: id } });
      if (exists) {
        return res.status(400).json({ message: 'NIC already exists' });
      }
    }

    // Convert dates & numbers
    if (updates.date_of_birth) updates.date_of_birth = new Date(updates.date_of_birth);
    if (updates.join_date) updates.join_date = new Date(updates.join_date);
    if (updates.basic_salary != null) updates.basic_salary = Number(updates.basic_salary);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    console.log(`✅ Employee updated in MongoDB: ${employee.name} (ID: ${employee.employee_id})`);
    return res.status(200).json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.NIC) return res.status(400).json({ message: 'NIC already exists' });
      if (error.keyPattern?.employee_id) return res.status(400).json({ message: 'Employee ID already exists' });
      return res.status(400).json({ message: 'Duplicate key', error: error.keyValue });
    }
    return res.status(500).json({ message: 'Server error while updating employee' });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    console.log(`🗑️ Employee deleted from MongoDB: ${employee.name} (ID: ${employee.employee_id})`);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Server error while deleting employee' });
  }
};

// Check if Employee ID exists (for frontend validation)
export const checkEmployeeId = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const exists = await checkUniqueness('employee_id', employee_id);
    return res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking employee ID:', error);
    return res.status(500).json({ message: 'Server error while checking employee ID' });
  }
};

// Check if NIC exists (for frontend validation)
export const checkNIC = async (req, res) => {
  try {
    const { nic } = req.params;
    const exists = await checkUniqueness('NIC', nic);
    return res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking NIC:', error);
    return res.status(500).json({ message: 'Server error while checking NIC' });
  }
};

// Check if Email exists (for frontend validation)
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);
    const exists = await checkUniqueness('email', decodedEmail);
    return res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Server error while checking email' });
  }
};