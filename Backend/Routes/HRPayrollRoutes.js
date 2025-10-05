import express from 'express';
import {
  generatePayrollForEmployee,
  generatePayrollBatch,
  getPayrolls,
  getPayrollById,
  updatePayrollStatus,
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

// Update payroll status
router.put('/:id/status', updatePayrollStatus);

// Delete payroll record
router.delete('/:id', deletePayroll);

export default router;