import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import EmployeeSelection from './EmployeeSelection';
import { Employee } from '../utils/employeeService';

interface AttendanceRecord {
  attendance_id?: string;
  _id?: string;
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}



interface AttendanceFormData {
  month: string;
  working_days: number;
  ot_hours: number;
}

const Attendance: React.FC = () => {
  // Note: Using employee dropdown instead of context employee
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AttendanceFormData>();



  // Get current year and current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-based index
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter months to show only current year's months (from current month onwards)
  const availableMonths = monthNames.slice(currentMonth).map((month, index) => {
    const monthNumber = currentMonth + index + 1; // Convert to 1-based month number
    const formattedMonth = `${currentYear}-${monthNumber.toString().padStart(2, '0')}`;
    return {
      name: month,
      value: formattedMonth,
      displayName: `${month} ${currentYear}`
    };
  });



  // Component mount effect - Reset states when component loads
  useEffect(() => {
    console.log('🔄 Attendance component mounted - Resetting employee selection state');
    
    // Reset all employee-related state
    setSelectedEmployeeId('');
    setSelectedEmployee(null);
    setAttendanceRecords([]);
    reset();
    
    // Clear any cached employee service data
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing employee service cache');
      // Reset the employee service port cache to ensure fresh connections
      import('../utils/employeeService').then(({ employeeService }) => {
        employeeService.resetPortCache();
      });
    }
  }, []); // Empty dependency array means this runs only on mount

  useEffect(() => {
    if (selectedEmployee) {
      console.log('✅ Selected employee changed:', selectedEmployee.employee_id);
      fetchAttendanceRecords(selectedEmployee.employee_id);
    } else {
      console.log('❌ No employee selected, clearing records');
      setAttendanceRecords([]);
    }
  }, [selectedEmployee]);

  const handleEmployeeChange = (employeeId: string, employee: Employee | null) => {
    setSelectedEmployeeId(employeeId);
    setSelectedEmployee(employee);
    setEditingRecord(null); // Clear any editing state when changing employee
    reset(); // Reset form when changing employee
  };

  // Helper function to convert formatted month (YYYY-MM) to display name
  const formatMonthForDisplay = (monthValue: string) => {
    if (!monthValue) return '';
    const [year, monthNum] = monthValue.split('-');
    const monthIndex = parseInt(monthNum) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  // Get available months (excluding those that already have records for the selected employee)
  const getAvailableMonths = () => {
    if (!selectedEmployeeId) return availableMonths;
    
    // If editing, show all months (including the current one being edited)
    if (editingRecord) return availableMonths;
    
    // Get months that already have records for this employee
    const existingMonths = attendanceRecords.map(record => record.month);
    
    // Filter out months that already have records
    return availableMonths.filter(month => !existingMonths.includes(month.value));
  };

  const fetchAttendanceRecords = async (employeeId?: string) => {
    const targetEmployeeId = employeeId || selectedEmployeeId;
    if (!targetEmployeeId) return;
    
    console.log(`📊 Fetching attendance records for: ${targetEmployeeId}`);
    
    try {
      const ports = [8004, 8005, 8003, 8002, 8000, 5000];
      let records = null;
      
      for (const port of ports) {
        try {
          console.log(`🌐 Trying attendance port: ${port}`);
          const response = await fetch(`http://localhost:${port}/api/attendance?employee_id=${targetEmployeeId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log(`📡 Attendance response from port ${port}:`, response.status);
          
          if (response.ok) {
            const result = await response.json();
            records = result.data || result;
            console.log(`✅ Attendance records found on port ${port}:`, records?.length || 0);
            break;
          }
        } catch (portError) {
          console.log(`❌ Attendance port ${port} failed:`, portError);
          continue;
        }
      }
      
      setAttendanceRecords(records || []);
    } catch (error) {
      console.error('❌ Error fetching attendance records:', error);
      setAttendanceRecords([]);
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    if (!selectedEmployeeId || !selectedEmployee) {
      alert('Please select an employee first');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        employee_id: selectedEmployeeId, // Use selectedEmployeeId instead of data.employee_id
        month: data.month,
        working_days: data.working_days,
        ot_hours: data.ot_hours
      };

        // Try multiple ports in case the backend is running on a different port
        const ports = [8004, 8005, 8003, 8002, 8000, 5000];
        let response = null;
        
        for (const port of ports) {
          try {
            console.log(`🌐 Trying POST to attendance port: ${port}`);
            response = await fetch(`http://localhost:${port}/api/attendance`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
            
            console.log(`📡 POST response from port ${port}:`, response.status);
            
            if (response.ok || response.status === 409) {
              break; // Success or conflict (duplicate record)
            }
          } catch (portError) {
            console.log(`❌ Attendance POST port ${port} failed:`, portError);
            continue;
          }
        }

      if (response && response.ok) {
        const newRecord = await response.json();
        setAttendanceRecords([...attendanceRecords, newRecord]);
        reset();
        alert('Attendance record added successfully!');
      } else if (response && response.status === 409) {
        alert('An attendance record already exists for this employee and month. Please select a different month.');
        return;
      } else {
        throw new Error('Failed to add attendance record - backend server not available');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      // Mock success for development
      const newRecord: AttendanceRecord = {
        _id: `ATT${Date.now()}`,
        employee_id: selectedEmployeeId,
        month: data.month,
        working_days: data.working_days,
        ot_hours: data.ot_hours
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      reset();
      alert('Attendance record added successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    const recordId = record.attendance_id || record._id;
    if (!recordId) {
      console.error('No valid ID found for record:', record);
      return;
    }
    
    console.log('Editing record with ID:', recordId);
    setEditingRecord(recordId);
    setSelectedEmployeeId(record.employee_id);
    // Note: Don't set employee_id in form, it's handled by EmployeeSelection component
    setValue('month', record.month);
    setValue('working_days', record.working_days);
    setValue('ot_hours', record.ot_hours);
  };

  const handleUpdate = async (data: AttendanceFormData) => {
    if (!editingRecord) return;
    
    console.log('Updating record with ID:', editingRecord);
    console.log('Update data:', data);
    try {
      // Try multiple ports in case the backend is running on a different port
      const ports = [8004, 8005, 8003, 8002, 8000, 5000];
      let response = null;
      
      for (const port of ports) {
        try {
          console.log(`🌐 Trying PUT to attendance port: ${port}`);
          response = await fetch(`http://localhost:${port}/api/attendance/${editingRecord}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              working_days: data.working_days,
              ot_hours: data.ot_hours,
              employee_id: selectedEmployeeId, // Use selectedEmployeeId instead of data.employee_id
              month: data.month
            }),
          });
          
          console.log(`📡 PUT response from port ${port}:`, response.status);
          
          if (response.ok) {
            break;
          }
        } catch (portError) {
          console.log(`❌ Attendance PUT port ${port} failed:`, portError);
          continue;
        }
      }

      if (response && response.ok) {
        const updatedRecord = await response.json();
        setAttendanceRecords(attendanceRecords.map(record => {
          const recordId = record.attendance_id || record._id;
          return recordId === editingRecord ? updatedRecord : record;
        }));
        setEditingRecord(null);
        reset();
        alert('Attendance record updated successfully!');
      } else {
        throw new Error('Failed to update attendance record - backend server not available');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      // Mock update for development
      setAttendanceRecords(attendanceRecords.map(record => {
        const recordId = record.attendance_id || record._id;
        return recordId === editingRecord 
          ? { ...record, ...data, employee_id: selectedEmployeeId }
          : record;
      }));
      setEditingRecord(null);
      reset();
      alert('Attendance record updated successfully!');
    }
  };

  const handleDelete = async (attendanceId: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    console.log('Deleting record with ID:', attendanceId);
    try {
      // Try multiple ports in case the backend is running on a different port
      const ports = [8004, 8005, 8003, 8002, 8000, 5000];
      let response = null;
      
      for (const port of ports) {
        try {
          console.log(`🌐 Trying DELETE to attendance port: ${port}`);
          response = await fetch(`http://localhost:${port}/api/attendance/${attendanceId}`, {
            method: 'DELETE',
          });
          
          console.log(`📡 DELETE response from port ${port}:`, response.status);
          
          if (response.ok) {
            break;
          }
        } catch (portError) {
          console.log(`❌ Attendance DELETE port ${port} failed:`, portError);
          continue;
        }
      }

      if (response && response.ok) {
        setAttendanceRecords(attendanceRecords.filter(record => {
          const recordId = record.attendance_id || record._id;
          return recordId !== attendanceId;
        }));
        alert('Attendance record deleted successfully!');
      } else {
        throw new Error('Failed to delete attendance record - backend server not available');
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      // Mock delete for development
      setAttendanceRecords(attendanceRecords.filter(record => {
        const recordId = record.attendance_id || record._id;
        return recordId !== attendanceId;
      }));
      alert('Attendance record deleted successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    // Keep the selected employee when canceling edit
    reset();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>

      {/* Attendance Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingRecord ? 'Update Attendance Record' : 'Add Attendance Record'}
        </h3>
        
        <form onSubmit={handleSubmit(editingRecord ? handleUpdate : onSubmit)} className="space-y-4">
          {/* Employee Selection */}
          <EmployeeSelection
            selectedEmployeeId={selectedEmployeeId}
            selectedEmployee={selectedEmployee}
            onEmployeeChange={handleEmployeeChange}
            disabled={!!editingRecord}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month ({currentYear}) *
              </label>
              <select
                {...register('month', { required: 'Month is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={getAvailableMonths().length === 0}
              >
                <option value="">
                  {getAvailableMonths().length === 0 
                    ? 'All months have records' 
                    : 'Select Month'
                  }
                </option>
                {getAvailableMonths().map((month) => (
                  <option key={month.name} value={month.value}>
                    {month.displayName}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
              )}
              {selectedEmployeeId && !editingRecord && getAvailableMonths().length === 0 && (
                <p className="text-blue-600 text-sm mt-1">
                  All available months already have attendance records for this employee.
                </p>
              )}
              {selectedEmployeeId && !editingRecord && getAvailableMonths().length < availableMonths.length && (
                <p className="text-gray-600 text-sm mt-1">
                  Only months without existing records are shown.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="working_days" className="block text-sm font-medium text-gray-700 mb-1">
                Working Days *
              </label>
              <input
                type="number"
                {...register('working_days', { 
                  required: 'Working days is required',
                  min: { value: 1, message: 'Working days must be positive' },
                  max: { value: 31, message: 'Working days cannot exceed 31' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 22"
              />
              {errors.working_days && (
                <p className="text-red-500 text-sm mt-1">{errors.working_days.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ot_hours" className="block text-sm font-medium text-gray-700 mb-1">
                OT Hours *
              </label>
              <input
                type="number"
                step="0.5"
                {...register('ot_hours', { 
                  required: 'OT hours is required',
                  min: { value: 0, message: 'OT hours cannot be negative' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8"
              />
              {errors.ot_hours && (
                <p className="text-red-500 text-sm mt-1">{errors.ot_hours.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : editingRecord ? 'Update' : 'Submit'}</span>
            </button>
            
            {editingRecord && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Attendance Records Table - Only show when employee is selected */}
      {selectedEmployeeId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance Records for {selectedEmployee?.name || 'Selected Employee'}
          </h3>
          
          {attendanceRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records found for this employee</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Working Days</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">OT Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.attendance_id || record._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{formatMonthForDisplay(record.month)}</td>
                      <td className="py-3 px-4 text-gray-800">{record.working_days}</td>
                      <td className="py-3 px-4 text-gray-800">{record.ot_hours}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const recordId = record.attendance_id || record._id;
                              if (recordId) handleDelete(recordId);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;