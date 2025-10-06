import express from 'express';
import {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
} from '../Controllers/AttendanceController.js';

const router = express.Router();

// Create new attendance record
router.post('/', createAttendance);

// Get all attendance records (with optional filtering and pagination)
router.get('/', getAllAttendance);

// Get a specific attendance record by ID
router.get('/:id', getAttendanceById);

// Update attendance record by ID
router.put('/:id', updateAttendance);

// Delete attendance record by ID
router.delete('/:id', deleteAttendance);

export default router;
