import express from 'express';
import { 
  getAllLeaveApplications,
  searchLeaveByEmployeeId,
  createLeaveApplication,
  updateLeaveStatus,
  deleteLeaveApplication
} from '../Controllers/HRLeaveController.js';

const router = express.Router();

// Get all leave applications
router.get('/', getAllLeaveApplications);

// Search leave applications by employee ID
router.get('/search/:employeeId', searchLeaveByEmployeeId);

// Create new leave application
router.post('/', createLeaveApplication);

// Update leave application status (Approve/Reject)
router.put('/:id/status', updateLeaveStatus);

// Delete leave application
router.delete('/:id', deleteLeaveApplication);

export default router;