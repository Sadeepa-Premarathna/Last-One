import LeaveApplication from '../Models/HRLeaveModel.js';
import Employee from '../Models/HREmployeeModel.js';
import mongoose from 'mongoose';

// Get all leave applications
export const getAllLeaveApplications = async (req, res) => {
  try {
    const leaveApplications = await LeaveApplication.find().sort({ applied_date: -1 });
    
    // Get employee details for each leave application
    const leaveWithEmployeeDetails = await Promise.all(
      leaveApplications.map(async (leave) => {
        try {
          const employee = await Employee.findOne({ employee_id: leave.employee_id });
          return {
            _id: leave._id,
            employeeId: leave.employee_id,
            employeeName: employee ? employee.name : 'Unknown Employee',
            employeeDepartment: employee ? employee.department : 'Unknown',
            employeeRole: employee ? employee.role : 'Unknown',
            leaveType: leave.leave_type === 'Sick' ? 'Sick Leave' : 
                       leave.leave_type === 'Casual' ? 'Casual Leave' :
                       leave.leave_type === 'Annual' ? 'Annual Leave' :
                       leave.leave_type === 'Maternity' ? 'Maternity Leave' : leave.leave_type,
            fromDate: leave.start_date,
            toDate: leave.end_date,
            reason: leave.reason,
            status: leave.status,
            appliedDate: leave.applied_date,
            approvedBy: leave.approved_by,
            approvedDate: leave.approved_date
          };
        } catch (error) {
          console.error(`Error fetching employee details for ${leave.employee_id}:`, error);
          return {
            _id: leave._id,
            employeeId: leave.employee_id,
            employeeName: 'Unknown Employee',
            employeeDepartment: 'Unknown',
            employeeRole: 'Unknown',
            leaveType: leave.leave_type,
            fromDate: leave.start_date,
            toDate: leave.end_date,
            reason: leave.reason,
            status: leave.status,
            appliedDate: leave.applied_date,
            approvedBy: leave.approved_by,
            approvedDate: leave.approved_date
          };
        }
      })
    );

    res.status(200).json(leaveWithEmployeeDetails);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ 
      message: 'Error fetching leave applications', 
      error: error.message 
    });
  }
};

// Search leave applications by employee ID
export const searchLeaveByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    console.log(`🔍 Searching for leave applications for employee ID: ${employeeId}`);

    // Find leave applications for the specific employee
    const leaveApplications = await LeaveApplication.find({ 
      employee_id: employeeId 
    }).sort({ applied_date: -1 });

    console.log(`📋 Found ${leaveApplications.length} leave applications for employee ${employeeId}`);

    if (leaveApplications.length === 0) {
      return res.status(404).json({ 
        message: `No leave applications found for employee ID: ${employeeId}`,
        data: []
      });
    }

    // Get employee details
    const employee = await Employee.findOne({ employee_id: employeeId });
    
    if (!employee) {
      console.warn(`⚠️ Employee not found for ID: ${employeeId}`);
      return res.status(404).json({ 
        message: `Employee not found for ID: ${employeeId}`,
        data: []
      });
    }

    // Transform leave data to match frontend expectations and combine with employee details
    const leaveWithEmployeeDetails = leaveApplications.map(leave => ({
      _id: leave._id,
      employeeId: leave.employee_id,
      employeeName: employee.name,
      employeeDepartment: employee.department,
      employeeRole: employee.role,
      employeeEmail: employee.email,
      employeePhone: employee.phone,
      leaveType: leave.leave_type === 'Sick' ? 'Sick Leave' : 
                 leave.leave_type === 'Casual' ? 'Casual Leave' :
                 leave.leave_type === 'Annual' ? 'Annual Leave' :
                 leave.leave_type === 'Maternity' ? 'Maternity Leave' : leave.leave_type,
      fromDate: leave.start_date,
      toDate: leave.end_date,
      reason: leave.reason,
      status: leave.status,
      appliedDate: leave.applied_date,
      approvedBy: leave.approved_by,
      approvedDate: leave.approved_date
    }));

    console.log(`✅ Successfully retrieved ${leaveWithEmployeeDetails.length} leave records with employee details`);

    res.status(200).json({
      message: `Found ${leaveApplications.length} leave applications for ${employee.name}`,
      data: leaveWithEmployeeDetails
    });

  } catch (error) {
    console.error('Error searching leave applications by employee ID:', error);
    res.status(500).json({ 
      message: 'Error searching leave applications', 
      error: error.message 
    });
  }
};

// Create a new leave application
export const createLeaveApplication = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    // Validate required fields
    if (!employeeId || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ 
        message: 'All fields are required: employeeId, leaveType, fromDate, toDate, reason' 
      });
    }

    // Verify employee exists
    const employee = await Employee.findOne({ employee_id: employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Transform leave type to match database format
    const dbLeaveType = leaveType === 'Sick Leave' ? 'Sick' :
                        leaveType === 'Casual Leave' ? 'Casual' :
                        leaveType === 'Annual Leave' ? 'Annual' :
                        leaveType === 'Maternity Leave' ? 'Maternity' : leaveType;

    // Generate leave ID
    const leaveId = `LV${Math.floor(Math.random() * 10000000)}`;

    // Create new leave application
    const newLeaveApplication = new LeaveApplication({
      employee_id: employeeId,
      leave_type: dbLeaveType,
      start_date: fromDate,
      end_date: toDate,
      reason: reason,
      leave_id: leaveId
    });

    const savedLeave = await newLeaveApplication.save();

    // Return with employee details and transformed fields
    const leaveWithEmployeeDetails = {
      _id: savedLeave._id,
      employeeId: savedLeave.employee_id,
      employeeName: employee.name,
      employeeDepartment: employee.department,
      employeeRole: employee.role,
      leaveType: leaveType, // Return original format for frontend
      fromDate: savedLeave.start_date,
      toDate: savedLeave.end_date,
      reason: savedLeave.reason,
      status: savedLeave.status,
      appliedDate: savedLeave.applied_date,
      approvedBy: savedLeave.approved_by,
      approvedDate: savedLeave.approved_date
    };

    res.status(201).json({
      message: 'Leave application created successfully',
      data: leaveWithEmployeeDetails
    });

  } catch (error) {
    console.error('Error creating leave application:', error);
    res.status(500).json({ 
      message: 'Error creating leave application', 
      error: error.message 
    });
  }
};

// Update leave application status (Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Approved or Rejected' });
    }

    const updatedLeave = await LeaveApplication.findByIdAndUpdate(
      id,
      { 
        status, 
        approved_by: approvedBy,
        approved_date: new Date()
      },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    // Get employee details
    const employee = await Employee.findOne({ employee_id: updatedLeave.employee_id });
    
    const leaveWithEmployeeDetails = {
      _id: updatedLeave._id,
      employeeId: updatedLeave.employee_id,
      employeeName: employee ? employee.name : 'Unknown Employee',
      employeeDepartment: employee ? employee.department : 'Unknown',
      employeeRole: employee ? employee.role : 'Unknown',
      leaveType: updatedLeave.leave_type === 'Sick' ? 'Sick Leave' : 
                 updatedLeave.leave_type === 'Casual' ? 'Casual Leave' :
                 updatedLeave.leave_type === 'Annual' ? 'Annual Leave' :
                 updatedLeave.leave_type === 'Maternity' ? 'Maternity Leave' : updatedLeave.leave_type,
      fromDate: updatedLeave.start_date,
      toDate: updatedLeave.end_date,
      reason: updatedLeave.reason,
      status: updatedLeave.status,
      appliedDate: updatedLeave.applied_date,
      approvedBy: updatedLeave.approved_by,
      approvedDate: updatedLeave.approved_date
    };

    res.status(200).json({
      message: 'Leave application status updated successfully',
      data: leaveWithEmployeeDetails
    });

  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ 
      message: 'Error updating leave status', 
      error: error.message 
    });
  }
};

// Delete leave application
export const deleteLeaveApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeave = await LeaveApplication.findByIdAndDelete(id);

    if (!deletedLeave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    res.status(200).json({ 
      message: 'Leave application deleted successfully',
      data: deletedLeave
    });

  } catch (error) {
    console.error('Error deleting leave application:', error);
    res.status(500).json({ 
      message: 'Error deleting leave application', 
      error: error.message 
    });
  }
};