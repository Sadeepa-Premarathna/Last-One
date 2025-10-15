import Leave from '../employee_Model/LeaveModel.js';
import Employee from '../employee_Model/EmployeeModel.js';

// Get all leaves or leaves by employee ID
export const getLeaves = async (req, res) => {
  try {
    const { employee_id } = req.query;
    
    let query = {};
    if (employee_id) {
      // Validate employee ID format
      if (!/^EMP\d{4}$/.test(employee_id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid employee ID format. Must be EMP followed by 4 digits (e.g., EMP0001)'
        });
      }
      
      // Skip employee existence check to avoid timeout issues
      // Employee validation will be done at the frontend level
      
      query.employee_id = employee_id;
    }

    const leaves = await Leave.find(query).sort({ applied_date: -1 }).lean().exec();
    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave records',
      error: error.message
    });
  }
};

// Get leaves by employee ID (specific endpoint)
export const getLeavesByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;
    
    // Validate employee ID format
    if (!/^EMP\d{4}$/.test(employee_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format. Must be EMP followed by 4 digits (e.g., EMP0001)'
      });
    }

    // Directly fetch leaves without employee validation to avoid timeout
    const leaves = await Leave.find({ employee_id }).sort({ applied_date: -1 }).lean().exec();
    
    res.status(200).json({
      success: true,
      data: leaves,
      message: `Found ${leaves.length} leave records for employee ${employee_id}`
    });
  } catch (error) {
    console.error('Error fetching leave records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave records for employee',
      error: error.message
    });
  }
};

// Get leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const { leave_id } = req.params;
    
    const leave = await Leave.findOne({ leave_id }).lean().exec();
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave record',
      error: error.message
    });
  }
};

// Create new leave application
export const createLeave = async (req, res) => {
  try {
    const { employee_id, leave_type, start_date, end_date, reason } = req.body;
    
    // Basic validation
    if (!employee_id || !leave_type || !start_date || !end_date || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate employee ID format
    if (!/^EMP\d{4}$/.test(employee_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format'
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create the leave application
    const newLeave = new Leave({
      employee_id,
      leave_type,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: 'Pending'
    });

    const savedLeave = await newLeave.save();
    
    console.log(`✅ Leave application created: ${savedLeave.leave_id} for ${employee_id}`);
    
    res.status(201).json({
      success: true,
      data: savedLeave,
      message: 'Leave application submitted successfully'
    });
  } catch (error) {
    console.error('❌ Error creating leave application:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating leave application',
      error: error.message
    });
  }
};

// Update leave application (only for pending leaves)
export const updateLeave = async (req, res) => {
  try {
    const { leave_id } = req.params;
    const { leave_type, start_date, end_date, reason } = req.body;
    
    const leave = await Leave.findOne({ leave_id }).lean().exec();
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave record not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update leave application that is not pending'
      });
    }

    // Validate dates if provided
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }

      // Check for overlapping leave applications (excluding current one)
      const overlappingLeave = await Leave.findOne({
        employee_id: leave.employee_id,
        leave_id: { $ne: leave_id },
        status: { $in: ['Pending', 'Approved'] },
        $or: [
          {
            start_date: { $lte: endDate },
            end_date: { $gte: startDate }
          }
        ]
      }).lean().exec();

      if (overlappingLeave) {
        return res.status(409).json({
          success: false,
          message: 'You have an overlapping leave application for the selected dates'
        });
      }
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { leave_id },
      {
        ...(leave_type && { leave_type }),
        ...(start_date && { start_date: new Date(start_date) }),
        ...(end_date && { end_date: new Date(end_date) }),
        ...(reason && { reason })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedLeave,
      message: 'Leave application updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating leave application',
      error: error.message
    });
  }
};

// Approve/Reject leave application
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leave_id } = req.params;
    const { status, approved_by, rejection_reason } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "Approved" or "Rejected"'
      });
    }

    const leave = await Leave.findOne({ leave_id }).lean().exec();
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave record not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave application has already been processed'
      });
    }

    const updateData = {
      status,
      approved_date: new Date(),
      approved_by
    };

    if (status === 'Rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { leave_id },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedLeave,
      message: `Leave application ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating leave status',
      error: error.message
    });
  }
};

// Delete leave application (only for pending leaves)
export const deleteLeave = async (req, res) => {
  try {
    const { leave_id } = req.params;
    
    const leave = await Leave.findOne({ leave_id }).lean().exec();
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave record not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete leave application that is not pending'
      });
    }

    await Leave.findOneAndDelete({ leave_id });

    res.status(200).json({
      success: true,
      message: 'Leave application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting leave application',
      error: error.message
    });
  }
};