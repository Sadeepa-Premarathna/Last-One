import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Download, Plus, Edit2, Trash2 } from 'lucide-react';
import EmployeeDetailModal from '../components/HREmployeeDetailModal';
import EmployeeAddForm from '../components/EmployeeAddForm';
import EditEmployeeModal from '../components/HREditEmployeeModal';
import { API_ENDPOINTS } from '../config/api';
import { Employee } from '../types';

interface EmployeeRecordsProps {
  onEmployeeUpdate?: (employee: Employee) => void;
  onEmployeeCreate?: (employee: Employee) => void;
  onEmployeeDelete?: (employeeId: string) => void;
}

const EmployeeRecords: React.FC<EmployeeRecordsProps> = ({ onEmployeeUpdate, onEmployeeCreate, onEmployeeDelete }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  // Fetch employees from API using Axios
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching employees from:', API_ENDPOINTS.employees);
      
      const response = await axios.get(API_ENDPOINTS.employees);
      const apiEmployees = response.data;
      
      // Transform API data to match frontend Employee interface
      const transformedEmployees: Employee[] = Array.isArray(apiEmployees) ? apiEmployees.map((e: any): Employee => ({
        id: e.id ?? e._id ?? crypto.randomUUID(),
        employeeId: e.employee_id ?? e.employeeId ?? '',
        name: e.name ?? '',
        nic: e.NIC ?? e.nic ?? '',
        role: e.role ?? '',
        department: e.department ?? '',
        status: (e.status ?? 'Active') as Employee['status'],
        joinDate: (e.join_date ? new Date(e.join_date).toISOString().slice(0,10) : ''),
        dateOfBirth: (e.date_of_birth ? new Date(e.date_of_birth).toISOString().slice(0,10) : ''),
        phone: e.phone ?? '',
        email: e.email ?? '',
        address: e.address ?? '',
        salary: Number(e.basic_salary ?? e.salary ?? 0),
        bankAccount: e.bankAccount ?? '',
        epfEligible: e.epfEligible ?? false,
        etfEligible: e.etfEligible ?? false,
        attendanceRate: e.attendanceRate ?? 0,
        gender: e.gender ?? '',
      })) : [];
      
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee update
  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    onEmployeeUpdate?.(updatedEmployee);
  };

  // Handle employee creation
  const handleEmployeeCreate = (newEmployee: Employee) => {
    // Refresh the list from backend to get the latest data
    fetchEmployees();
    onEmployeeCreate?.(newEmployee);
  };

  // Handle employee deletion
  const handleEmployeeDelete = (deletedEmployeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== deletedEmployeeId));
    onEmployeeDelete?.(deletedEmployeeId);
  };

  // Get unique values for filter options
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].sort(), 
    [employees]
  );
  
  const roles = useMemo(() => 
    [...new Set(employees.map(emp => emp.role))].sort(), 
    [employees]
  );

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
      const matchesRole = !selectedRole || employee.role === selectedRole;
      const matchesStatus = !selectedStatus || employee.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });

    // Sort employees (skip sorting for 'recent' to preserve backend order)
    if (sortBy !== 'recent') {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'dateOfBirth':
            aValue = new Date(a.dateOfBirth);
            bValue = new Date(b.dateOfBirth);
            break;
          case 'joinDate':
            aValue = new Date(a.joinDate);
            bValue = new Date(b.joinDate);
            break;
          case 'salary':
            aValue = a.salary;
            bValue = b.salary;
            break;
          case 'employeeId':
            aValue = a.employeeId;
            bValue = b.employeeId;
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, selectedDepartment, selectedRole, selectedStatus, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Resigned':
        return 'bg-red-100 text-red-800';
      case 'On Probation':
        return 'bg-orange-100 text-orange-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Role', 'Join Date', 'Status', 'Salary'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeId,
        emp.name,
        emp.department,
        emp.role,
        emp.joinDate,
        emp.status,
        emp.salary
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedRole('');
    setSelectedStatus('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error Loading Employees</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchEmployees}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Records</h1>
            <p className="text-gray-600 mt-1">Manage and view all employee information</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Resigned">Resigned</option>
                    <option value="On Probation">On Probation</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="recent-desc">Recently Added</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="joinDate-desc">Join Date (Newest)</option>
                    <option value="joinDate-asc">Join Date (Oldest)</option>
                    <option value="salary-desc">Salary (High-Low)</option>
                    <option value="salary-asc">Salary (Low-High)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length} employees
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeId')}
                >
                  Employee ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dateOfBirth')}
                >
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr 
                  key={employee.id} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.nic || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <button
                        title="Edit"
                        className="text-blue-700 hover:text-blue-900"
                        onClick={(e) => { e.stopPropagation(); setEditing(employee); }}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        title="Delete"
                        className="text-red-700 hover:text-red-900"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm(`Delete ${employee.name}? This cannot be undone.`)) return;
                          try {
                            await axios.delete(`${API_ENDPOINTS.employees}/${employee.id}`);
                            // Successfully deleted - update local state and notify parent
                            handleEmployeeDelete(employee.id);
                          } catch (err: any) {
                            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete employee';
                            alert(errorMessage);
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={handleEmployeeUpdate}
        />
      )}

        {/* Add Employee Modal */}
        {showAddModal && (
          <EmployeeAddForm
            onClose={() => setShowAddModal(false)}
            onCreate={(emp) => {
              handleEmployeeCreate(emp);
              setShowAddModal(false);
            }}
          />
        )}      {editing && (
        <EditEmployeeModal
          employee={editing}
          onClose={() => setEditing(null)}
          onUpdated={(updated) => {
            setEditing(null);
            handleEmployeeUpdate(updated);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeRecords;