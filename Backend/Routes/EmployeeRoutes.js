import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../Controllers/EmployeeController.js';

const router = express.Router();

// Get all employees
router.get('/', getEmployees);

// Get employee by ID
router.get('/:employee_id', getEmployeeById);

// Create new employee
router.post('/', createEmployee);

// Update employee
router.put('/:employee_id', updateEmployee);

// Delete employee (soft delete)
router.delete('/:employee_id', deleteEmployee);

export default router;