import express from 'express';
import {
  getAttendanceRecords,
  getAttendanceStats,
  createOrUpdateAttendance,
  bulkCreateAttendance,
  deleteAttendanceRecord
} from '../Controllers/HRAttendanceController.js';

const router = express.Router();

// Get attendance records with filtering
// Query params: date, employeeId, startDate, endDate, status, department, page, limit
router.get('/', getAttendanceRecords);

// Get attendance statistics
// Query params: date, startDate, endDate
router.get('/stats', getAttendanceStats);

// Create or update attendance record
router.post('/', createOrUpdateAttendance);

// Bulk create/update attendance records
router.post('/bulk', bulkCreateAttendance);

// Delete attendance record by ID
router.delete('/:id', deleteAttendanceRecord);

export default router;