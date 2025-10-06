import express from 'express';
import {
  generatePayrollForEmployee,
  generatePayrollBatch,
  getPayrolls,
  getPayrollById,
  deletePayroll
} from '../Controllers/HRPayrollController.js';

const router = express.Router();

// 🚀 Generate payroll for a single employee
router.post('/generate', generatePayrollForEmployee);

// 🚀 Generate payroll for multiple employees (batch)
router.post('/generate/batch', generatePayrollBatch);

// Get all payroll records with optional filtering
router.get('/', getPayrolls);

// Get specific payroll by ID
router.get('/:id', getPayrollById);

// Delete payroll record
router.delete('/:id', deletePayroll);

export default router;