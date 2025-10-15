import Attendance from '../employee_Model/AttendanceModel.js';
import mongoose from 'mongoose';

// Get all attendance records with optional filters
const getAllAttendance = async (req, res) => {
  try {
    const { employee_id, month, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (employee_id) filter.employee_id = employee_id;
    if (month) filter.month = month;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const attendanceRecords = await Attendance.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Attendance.countDocuments(filter);

    return res.status(200).json({
      data: attendanceRecords,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_records: total,
        has_next: pageNum < Math.ceil(total / limitNum),
        has_prev: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({ message: "Server error while fetching attendance records" });
  }
};

// Create a new attendance record
const createAttendance = async (req, res) => {
  try {
    const { employee_id, month, working_days, ot_hours } = req.body;

    // Validation
    if (!employee_id || !month || working_days === undefined) {
      return res.status(400).json({ 
        message: "employee_id, month, and working_days are required" 
      });
    }

    if (working_days < 0) {
      return res.status(400).json({ message: "Working days must be 0 or greater" });
    }

    if (ot_hours !== undefined && ot_hours < 0) {
      return res.status(400).json({ message: "OT hours must be 0 or greater" });
    }

    // Check if attendance already exists for this employee and month
    const existingAttendance = await Attendance.findOne({ employee_id, month });
    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance record already exists for this employee and month"
      });
    }

    const attendance = await Attendance.create({
      employee_id,
      month,
      working_days,
      ot_hours: ot_hours || 0
    });

    return res.status(201).json(attendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    return res.status(500).json({ message: "Server error while creating attendance" });
  }
};

// Update an existing attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { working_days, ot_hours, month, employee_id } = req.body;

    // Validation
    if (working_days !== undefined && working_days < 0) {
      return res.status(400).json({ message: "Working days must be 0 or greater" });
    }

    if (ot_hours !== undefined && ot_hours < 0) {
      return res.status(400).json({ message: "OT hours must be 0 or greater" });
    }

    let attendance = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      attendance = await Attendance.findById(id);
    } else {
      // Fallback: allow update by employee_id + month
      const resolvedEmployeeId = employee_id || id;
      const resolvedMonth = month || req.query.month;
      if (!resolvedEmployeeId || !resolvedMonth) {
        return res.status(400).json({ message: "Invalid ID. Provide valid _id in path or employee_id and month." });
      }
      attendance = await Attendance.findOne({ employee_id: resolvedEmployeeId, month: resolvedMonth });
    }

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Update fields if provided
    const update = {};
    if (working_days !== undefined) update.working_days = working_days;
    if (ot_hours !== undefined) update.ot_hours = ot_hours;

    const updated = await Attendance.findByIdAndUpdate(attendance._id, update, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ message: "Server error while updating attendance" });
  }
};

// Delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, month } = req.query;

    let attendance = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      attendance = await Attendance.findByIdAndDelete(id);
    } else if (employee_id && month) {
      attendance = await Attendance.findOneAndDelete({ employee_id, month });
    } else {
      return res.status(400).json({ message: "Invalid ID. Provide valid _id in path or employee_id and month as query." });
    }

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return res.status(500).json({ message: "Server error while deleting attendance" });
  }
};

// Get a specific attendance record by ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    let attendance = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      attendance = await Attendance.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid attendance ID format" });
    }

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance by ID:", error);
    return res.status(500).json({ message: "Server error while fetching attendance record" });
  }
};

export { getAllAttendance, getAttendanceById, createAttendance, updateAttendance, deleteAttendance };
