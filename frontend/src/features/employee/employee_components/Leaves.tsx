import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import EmployeeSelection from './EmployeeSelection';
import { Employee } from '../employee_utils/employeeService';

interface LeaveRecord {
  leave_id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

interface LeaveFormData {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

const Leaves: React.FC = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<LeaveFormData>();

  const leaveTypes = ['Sick', 'Casual', 'Annual'];

  const startDate = watch('start_date');

  const handleEmployeeChange = (employeeId: string, employee: Employee | null) => {
    setSelectedEmployeeId(employeeId);
    setSelectedEmployee(employee);
    setEditingRecord(null);
    reset();
  };

  // Component mount effect - Reset states when component loads
  useEffect(() => {
    console.log('🔄 Leaves component mounted - Resetting employee selection state');
    
    // Reset all employee-related state
    setSelectedEmployeeId('');
    setSelectedEmployee(null);
    setLeaveRecords([]);
    reset();
    
    // Clear any cached employee service data
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing employee service cache');
      // Reset the employee service port cache to ensure fresh connections
      import('../employee_utils/employeeService').then(({ employeeService }) => {
        employeeService.resetPortCache();
      });
    }
  }, []); // Empty dependency array means this runs only on mount

  useEffect(() => {
    if (selectedEmployee) {
      console.log('✅ Selected employee changed:', selectedEmployee.employee_id);
      fetchLeaveRecords(selectedEmployee.employee_id);
    } else {
      console.log('❌ No employee selected, clearing records');
      setLeaveRecords([]);
    }
  }, [selectedEmployee]);

  const fetchLeaveRecords = async (employeeId: string) => {
    if (!employeeId) {
      setLeaveRecords([]);
      return;
    }
    
    try {
      const ports = [8004, 8005, 8003, 8002, 8000, 5000];
      let success = false;
      
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}/api/leaves/employee/${employeeId}`);
          
          if (response.ok) {
            const result = await response.json();
            
            // Extract the actual leave records array
            const leaveArray = result.data || result.leaves || [];
            
            if (Array.isArray(leaveArray)) {
              const mappedData = leaveArray.map((record: any) => ({
                id: record._id,
                leave_id: record.leave_id,
                employee_id: record.employee_id || employeeId,
                leave_type: record.leave_type,
                start_date: record.start_date?.split('T')[0],
                end_date: record.end_date?.split('T')[0],
                reason: record.reason,
                status: record.status,
                applied_date: record.applied_date?.split('T')[0] || record.createdAt?.split('T')[0]
              }));
              
              setLeaveRecords(mappedData);
              success = true;
              break;
            }
          }
        } catch (portError) {
          continue;
        }
      }
      
      if (!success) {
        setLeaveRecords([]); // Always set empty array, never show mock data
      }
    } catch (error) {
      console.error('❌ Error fetching leave records:', error);
      setLeaveRecords([]); // Always set empty array on error
    }
  };

  const onSubmit = async (data: LeaveFormData) => {
    if (!selectedEmployee) return;
    
    setLoading(true);
    try {
      const payload = {
        ...data,
        employee_id: selectedEmployee.employee_id,
        status: 'Pending'
      };

      const ports = [8004, 8005, 8003, 8002, 8000, 5000];
      let success = false;
      
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}/api/leaves`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            // Refresh leave records
            await fetchLeaveRecords(selectedEmployee.employee_id);
            reset();
            alert('Leave application submitted successfully!');
            success = true;
            break;
          }
        } catch (portError) {
          console.log(`Port ${port} not available for leave submission, trying next...`);
          continue;
        }
      }
      
      if (!success) {
        throw new Error('Could not submit leave application - no server available');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Error submitting leave application: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: LeaveRecord) => {
    setEditingRecord(record.leave_id);
    setValue('leave_type', record.leave_type);
    setValue('start_date', record.start_date);
    setValue('end_date', record.end_date);
    setValue('reason', record.reason);
  };

  const handleUpdate = async (data: LeaveFormData) => {
    if (!editingRecord) return;
    
    try {
      const ports = [8003, 8002, 8000, 5000];
      let success = false;
      
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}/api/leaves/${editingRecord}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // Refresh leave records instead of manual update
            if (selectedEmployee) {
              await fetchLeaveRecords(selectedEmployee.employee_id);
            }
            setEditingRecord(null);
            reset();
            alert('Leave application updated successfully!');
            success = true;
            break;
          }
        } catch (portError) {
          console.log(`Port ${port} not available for leave update, trying next...`);
          continue;
        }
      }
      
      if (!success) {
        throw new Error('Could not update leave application - no server available');
      }
    } catch (error) {
      console.error('Error updating leave:', error);
      alert('Error updating leave application: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    reset();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Apply for Leave</h1>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingRecord ? 'Update Leave Application' : 'Submit Leave Application'}
        </h3>
        
        {/* Employee Selection */}
        <EmployeeSelection
          selectedEmployeeId={selectedEmployeeId}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={handleEmployeeChange}
          disabled={!!editingRecord}
        />

        
        <form onSubmit={handleSubmit(editingRecord ? handleUpdate : onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type *
              </label>
              <select
                {...register('leave_type', { required: 'Leave type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.leave_type && (
                <p className="text-red-500 text-sm mt-1">{errors.leave_type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                {...register('end_date', { 
                  required: 'End date is required',
                  validate: (value) => {
                    if (startDate && value <= startDate) {
                      return 'End date must be after start date';
                    }
                    return true;
                  }
                })}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              {...register('reason', { 
                required: 'Reason is required',
                minLength: { value: 10, message: 'Reason must be at least 10 characters' }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide a detailed reason for your leave..."
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !selectedEmployee}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : editingRecord ? 'Update' : 'Submit'}</span>
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

      {/* Leave Records Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Leave Applications</h3>
        
        {leaveRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leave applications found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Leave Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRecords.map((record) => (
                  <tr key={record.leave_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{record.leave_type}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {format(new Date(record.start_date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {format(new Date(record.end_date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate">
                      {record.reason}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(record)}
                        disabled={record.status !== 'Pending'}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={record.status !== 'Pending' ? 'Cannot edit approved/rejected applications' : 'Edit'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaves;