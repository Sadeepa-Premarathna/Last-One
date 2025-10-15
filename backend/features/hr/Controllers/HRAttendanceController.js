import DailyAttendance from '../Models/HRDailyAttendanceModel.js';
import Employee from '../Models/HREmployeeModel.js';

// Get attendance records with filtering options
export const getAttendanceRecords = async (req, res) => {
  try {
    const { 
      date, 
      employeeId, 
      startDate, 
      endDate, 
      status, 
      department,
      page = 1, 
      limit = 100 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (date) {
      filter.date = date;
    } else if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }
    
    if (employeeId) {
      filter.employeeId = employeeId;
    }
    
    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get attendance records with pagination
    let attendanceRecords = await DailyAttendance.find(filter)
      .sort({ date: -1, employeeId: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Initial attendance records count:', attendanceRecords.length);
    console.log('Attendance records:', attendanceRecords);

    // If department filter is specified, we need to filter by employee department
    if (department) {
      // Get all employees from that department
      const departmentEmployees = await Employee.find({ department });
      const departmentEmployeeIds = departmentEmployees.map(emp => emp.employee_id);
      
      // Filter attendance records by department employee IDs
      attendanceRecords = attendanceRecords.filter(record => 
        departmentEmployeeIds.includes(record.employeeId)
      );
    }

    // Get employee details for each attendance record
    const employeeIds = [...new Set(attendanceRecords.map(record => record.employeeId))];
    const employees = await Employee.find({ employee_id: { $in: employeeIds } });
    const employeeMap = {};
    employees.forEach(emp => {
      employeeMap[emp.employee_id] = emp;
    });

    // Enrich attendance records with employee information
    const enrichedRecords = attendanceRecords.map(record => {
      const employee = employeeMap[record.employeeId];
      return {
        id: record._id.toString(),
        employeeId: record.employeeId,
        date: record.date,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        status: record.status,
        hoursWorked: record.hoursWorked,
        correctionReason: record.correctionReason,
        correctedBy: record.correctedBy,
        correctedAt: record.correctedAt,
        requiresApproval: record.requiresApproval,
        uploadedBy: record.uploadedBy,
        uploadedAt: record.uploadedAt,
        employee: employee ? {
          id: employee._id.toString(),
          employeeId: employee.employee_id,
          name: employee.name,
          department: employee.department,
          role: employee.role
        } : null
      };
    });

    // Get total count for pagination
    const total = await DailyAttendance.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: enrichedRecords,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total: total
      },
      count: enrichedRecords.length
    });

  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get attendance statistics for a specific date or date range
export const getAttendanceStats = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;

    let dateFilter = {};
    if (date) {
      dateFilter.date = date;
    } else if (startDate && endDate) {
      dateFilter.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to today if no date specified
      const today = new Date().toISOString().split('T')[0];
      dateFilter.date = today;
    }

    // Get attendance statistics
    const stats = await DailyAttendance.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform stats into a more usable format
    const statsMap = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Leave: 0
    };

    stats.forEach(stat => {
      if (statsMap.hasOwnProperty(stat._id)) {
        statsMap[stat._id] = stat.count;
      }
    });

    // Get total employees for comparison
    const totalActiveEmployees = await Employee.countDocuments({ status: 'Active' });

    res.status(200).json({
      success: true,
      data: {
        stats: statsMap,
        total: Object.values(statsMap).reduce((sum, count) => sum + count, 0),
        totalActiveEmployees,
        attendanceRate: totalActiveEmployees > 0 ? 
          ((statsMap.Present + statsMap.Late) / totalActiveEmployees * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: error.message
    });
  }
};

// Create or update attendance record
export const createOrUpdateAttendance = async (req, res) => {
  try {
    const { 
      employeeId, 
      date, 
      clockIn, 
      clockOut, 
      status,
      correctionReason,
      correctedBy 
    } = req.body;

    // Validate required fields
    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'employeeId, date, and status are required'
      });
    }

    // Validate employee exists
    const employee = await Employee.findOne({ employee_id: employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if record already exists
    const existingRecord = await DailyAttendance.findOne({ employeeId, date });

    if (existingRecord) {
      // Update existing record
      const updateData = {
        clockIn,
        clockOut,
        status,
        updatedAt: new Date()
      };

      if (correctionReason) {
        updateData.correctionReason = correctionReason;
        updateData.correctedBy = correctedBy;
        updateData.correctedAt = new Date();
        updateData.requiresApproval = true;
      }

      const updatedRecord = await DailyAttendance.findByIdAndUpdate(
        existingRecord._id,
        updateData,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Attendance record updated successfully',
        data: {
          id: updatedRecord._id.toString(),
          employeeId: updatedRecord.employeeId,
          date: updatedRecord.date,
          clockIn: updatedRecord.clockIn,
          clockOut: updatedRecord.clockOut,
          status: updatedRecord.status,
          hoursWorked: updatedRecord.hoursWorked,
          correctionReason: updatedRecord.correctionReason,
          correctedBy: updatedRecord.correctedBy,
          correctedAt: updatedRecord.correctedAt,
          requiresApproval: updatedRecord.requiresApproval
        }
      });
    } else {
      // Create new record
      const newRecord = new DailyAttendance({
        employeeId,
        date,
        clockIn,
        clockOut,
        status,
        correctionReason,
        correctedBy,
        correctedAt: correctionReason ? new Date() : undefined,
        requiresApproval: !!correctionReason
      });

      const savedRecord = await newRecord.save();

      res.status(201).json({
        success: true,
        message: 'Attendance record created successfully',
        data: {
          id: savedRecord._id.toString(),
          employeeId: savedRecord.employeeId,
          date: savedRecord.date,
          clockIn: savedRecord.clockIn,
          clockOut: savedRecord.clockOut,
          status: savedRecord.status,
          hoursWorked: savedRecord.hoursWorked,
          correctionReason: savedRecord.correctionReason,
          correctedBy: savedRecord.correctedBy,
          correctedAt: savedRecord.correctedAt,
          requiresApproval: savedRecord.requiresApproval
        }
      });
    }

  } catch (error) {
    console.error('Error creating/updating attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing attendance record',
      error: error.message
    });
  }
};

// Bulk create attendance records
export const bulkCreateAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'records array is required'
      });
    }

    const results = {
      created: [],
      updated: [],
      errors: []
    };

    for (const record of records) {
      try {
        const { employeeId, date, clockIn, clockOut, status } = record;

        // Validate employee exists
        const employee = await Employee.findOne({ employee_id: employeeId });
        if (!employee) {
          results.errors.push({
            employeeId,
            date,
            message: 'Employee not found'
          });
          continue;
        }

        // Check if record already exists
        const existingRecord = await DailyAttendance.findOne({ employeeId, date });

        if (existingRecord) {
          // Update existing record
          await DailyAttendance.findByIdAndUpdate(existingRecord._id, {
            clockIn,
            clockOut,
            status,
            uploadedBy: 'bulk_upload',
            uploadedAt: new Date(),
            updatedAt: new Date()
          });

          results.updated.push({ employeeId, date });
        } else {
          // Create new record
          await DailyAttendance.create({
            employeeId,
            date,
            clockIn,
            clockOut,
            status,
            uploadedBy: 'bulk_upload',
            uploadedAt: new Date()
          });

          results.created.push({ employeeId, date });
        }

      } catch (error) {
        results.errors.push({
          employeeId: record.employeeId,
          date: record.date,
          message: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk attendance upload completed',
      summary: {
        total: records.length,
        created: results.created.length,
        updated: results.updated.length,
        errors: results.errors.length
      },
      data: results
    });

  } catch (error) {
    console.error('Error in bulk attendance upload:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing bulk attendance upload',
      error: error.message
    });
  }
};

// Delete attendance record
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecord = await DailyAttendance.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully',
      data: {
        id: deletedRecord._id.toString(),
        employeeId: deletedRecord.employeeId,
        date: deletedRecord.date
      }
    });

  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance record',
      error: error.message
    });
  }
};