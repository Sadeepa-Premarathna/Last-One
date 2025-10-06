import express from 'express';
import {
  getLeaves,
  getLeavesByEmployee,
  getLeaveById,
  createLeave,
  updateLeave,
  updateLeaveStatus,
  deleteLeave
} from '../Controllers/LeaveController.js';

const router = express.Router();

// Get all leaves or filter by employee_id query parameter
router.get('/', getLeaves);

// Get leaves by employee ID
router.get('/employee/:employee_id', getLeavesByEmployee);

// Get leave by leave ID
router.get('/:leave_id', getLeaveById);

// Create new leave application
router.post('/', createLeave);

// Update leave application (for pending leaves only)
router.put('/:leave_id', updateLeave);

// Approve/Reject leave application
router.patch('/:leave_id/status', updateLeaveStatus);

// Delete leave application (for pending leaves only)
router.delete('/:leave_id', deleteLeave);

export default router;