import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Check, 
  X, 
  Filter, 
  Search,
  FileText,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface LeaveRequest {
  _id?: string;
  id?: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment?: string;
  employeeRole?: string;
  employeeEmail?: string;
  employeePhone?: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Annual Leave' | 'Maternity Leave';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  totalDays?: number;
}

interface ApplyLeaveForm {
  employeeId: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
}

interface SearchResult {
  message: string;
  data: LeaveRequest[];
}

const LeaveManagement: React.FC = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchResults, setSearchResults] = useState<LeaveRequest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch all leave applications on component mount
  const fetchLeaveApplications = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🔄 Fetching all leave applications...');
      
      const response = await axios.get(API_ENDPOINTS.leaves);
      
      if (response.data && Array.isArray(response.data)) {
        setLeaveRequests(response.data);
        console.log(`✅ Loaded ${response.data.length} leave applications`);
      } else {
        setLeaveRequests([]);
        console.log('⚠️ No leave applications found');
      }
    } catch (error: any) {
      console.error('❌ Error fetching leave applications:', error);
      setError('Failed to load leave applications. Please try again.');
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLeaveApplications();
    fetchEmployees();
  }, []);

  // Apply Leave Form State
  const [applyLeaveForm, setApplyLeaveForm] = useState<ApplyLeaveForm>({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Employee list state for dropdown
  const [employees, setEmployees] = useState<Array<{id: string, name: string, employee_id: string}>>([]);

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      console.log('🔄 Fetching employees for dropdown...');
      const response = await axios.get(API_ENDPOINTS.employees);
      
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data);
        console.log(`✅ Loaded ${response.data.length} employees for dropdown`);
      }
    } catch (error: any) {
      console.error('❌ Error fetching employees:', error);
    }
  };

  const leaveTypes = [
    'Sick Leave',
    'Casual Leave',
    'Annual Leave',
    'Maternity Leave'
  ];

  // Search leave applications by employee ID
  const searchLeavesByEmployeeId = async (employeeId: string) => {
    if (!employeeId.trim()) {
      setSearchResults([]);
      setSearchMessage('');
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    
    try {
      console.log(`🔍 Searching for leaves for employee ID: ${employeeId}`);
      const response = await axios.get(`${API_ENDPOINTS.leaves}/search/${employeeId.trim()}`);
      
      if (response.data.data && response.data.data.length > 0) {
        setSearchResults(response.data.data);
        setSearchMessage(response.data.message);
        setHasSearched(true);
      } else {
        setSearchResults([]);
        setSearchMessage(`No leave applications found for employee ID: ${employeeId}`);
        setHasSearched(true);
      }
    } catch (error: any) {
      console.error('Error searching leaves:', error);
      setSearchResults([]);
      if (error.response?.status === 404) {
        setSearchMessage(error.response.data.message || `No leave applications found for employee ID: ${employeeId}`);
      } else {
        setSearchMessage('Error searching leave applications. Please try again.');
      }
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input keypress (Enter key)
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchLeavesByEmployeeId(searchTerm);
    }
  };

  // Update leave status (Approve/Reject)
  const updateLeaveStatus = async (leaveId: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.leaves}/${leaveId}/status`, {
        status: newStatus,
        approvedBy: 'Alex Martinez' // HR Manager name
      });

      if (response.data.data) {
        // Update the search results if we're showing search results
        if (hasSearched && searchResults.length > 0) {
          setSearchResults(prev => prev.map(request => 
            (request._id || request.id) === leaveId 
              ? { ...request, status: newStatus, approvedBy: 'Alex Martinez', approvedDate: new Date().toISOString().split('T')[0] }
              : request
          ));
        }
        
        // Also update the mock data for consistency
        setLeaveRequests(prev => prev.map(request => 
          (request._id || request.id) === leaveId 
            ? { 
                ...request, 
                status: newStatus,
                approvedBy: 'Alex Martinez',
                approvedDate: new Date().toISOString().split('T')[0]
              }
            : request
        ));

        console.log(`✅ Leave application ${newStatus.toLowerCase()} successfully`);
      }
    } catch (error: any) {
      console.error('Error updating leave status:', error);
      alert('Error updating leave status. Please try again.');
    }
  };

  // Determine which data to display
  const displayData = hasSearched ? searchResults : leaveRequests;

  // Filter requests based on search and filters
  const filteredRequests = displayData.filter(request => {
    // If we have search results, no need to filter by search term again
    const matchesSearch = hasSearched ? true : (
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesLeaveType = !leaveTypeFilter || request.leaveType === leaveTypeFilter;
    
    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const pendingRequests = filteredRequests.filter(request => request.status === 'Pending');
  const historyRequests = filteredRequests.filter(request => request.status !== 'Pending');

  // Handle status change (Approve/Reject) - using the new API function
  const handleStatusChange = (id: string | undefined, newStatus: 'Approved' | 'Rejected') => {
    if (!id) {
      console.error('No ID provided for status change');
      return;
    }
    updateLeaveStatus(id, newStatus);
  };

  // Handle apply leave form submission
  const handleApplyLeave = async () => {
    if (!applyLeaveForm.employeeId || !applyLeaveForm.leaveType || 
        !applyLeaveForm.fromDate || !applyLeaveForm.toDate || !applyLeaveForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('📝 Creating new leave application...');
      const response = await axios.post(API_ENDPOINTS.leaves, {
        employeeId: applyLeaveForm.employeeId,
        leaveType: applyLeaveForm.leaveType,
        fromDate: applyLeaveForm.fromDate,
        toDate: applyLeaveForm.toDate,
        reason: applyLeaveForm.reason
      });

      if (response.data && response.data.data) {
        console.log('✅ Leave application created successfully');
        
        // Refresh the leave applications list
        await fetchLeaveApplications();
        
        // Reset form
        setApplyLeaveForm({
          employeeId: '',
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: ''
        });
        
        setShowApplyModal(false);
        alert('Leave application submitted successfully!');
      }
    } catch (error: any) {
      console.error('❌ Error creating leave application:', error);
      alert('Error submitting leave application. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateDays = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leave applications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchLeaveApplications();
              }}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Try Again
            </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by Employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Leave Types</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Message */}
      {isSearching && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">🔍 Searching for leave applications...</p>
        </div>
      )}

      {hasSearched && searchMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          searchResults.length > 0 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`${
            searchResults.length > 0 ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {searchResults.length > 0 ? '✅' : '⚠️'} {searchMessage}
          </p>
          {hasSearched && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setSearchMessage('');
                setHasSearched(false);
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear search and show all leave requests
            </button>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {leaveRequests.filter(r => r.status === 'Approved' && r.approvedDate === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Leave Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {leaveRequests.filter(r => {
                  const today = new Date().toISOString().split('T')[0];
                  return r.status === 'Approved' && r.fromDate <= today && r.toDate >= today;
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-gray-600">{leaveRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending Requests ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Leave History ({historyRequests.length})
            </button>
          </nav>
        </div>

        {/* Pending Requests Table */}
        {activeTab === 'pending' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request, index) => (
                  <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                          <div className="text-sm text-gray-500">{request.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{calculateDays(request.fromDate, request.toDate)} days</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(request.id, 'Approved')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, 'Rejected')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending leave requests found.</p>
              </div>
            )}
          </div>
        )}

        {/* Leave History Table */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyRequests.map((request, index) => (
                  <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.fromDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.approvedBy || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {historyRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leave history found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Employee Name Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyLeaveForm.employeeId}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.employee_id}>
                        {employee.employee_id} - {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leave Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyLeaveForm.leaveType}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, leaveType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={applyLeaveForm.fromDate}
                      onChange={(e) => setApplyLeaveForm({...applyLeaveForm, fromDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={applyLeaveForm.toDate}
                      onChange={(e) => setApplyLeaveForm({...applyLeaveForm, toDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Reason Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={applyLeaveForm.reason}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, reason: e.target.value})}
                    rows={4}
                    placeholder="Please provide a reason for your leave request..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Duration Display */}
                {applyLeaveForm.fromDate && applyLeaveForm.toDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Duration:</strong> {calculateDays(applyLeaveForm.fromDate, applyLeaveForm.toDate)} days
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLeave}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;