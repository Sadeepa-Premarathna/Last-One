import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, Download, Search, Filter, ChevronLeft, ChevronRight, Edit, Check, X, AlertCircle, FileText } from 'lucide-react';
import { AttendanceRecord, Employee } from '../types';
import { API_ENDPOINTS } from '../config/api';
import AttendanceCorrectionModal from '../components/HRAttendanceCorrectionModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DairyLiciousLogo from '../assest/WhatsApp Image 2025-10-07 at 17.43.54_b4cf94d4.jpg';

interface AttendanceTrackingProps {}

const AttendanceTracking: React.FC<AttendanceTrackingProps> = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState(''); // Now for Employee ID only
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // New state for API data
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    Present: 0,
    Absent: 0,
    Late: 0,
    Leave: 0
  });

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.employees);
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees data');
    }
  };

  // Fetch attendance records
  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const params: any = { date: dateStr };
      
      // Add search filter for Employee ID only
      if (searchTerm.trim()) {
        params.employeeId = searchTerm.trim();
      }
      
      if (selectedDepartment) {
        params.department = selectedDepartment;
      }
      
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await axios.get(API_ENDPOINTS.attendance, { params });
      
      if (response.data.success) {
        const records = response.data.data.map((record: any) => ({
          id: record.id,
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
          employee: record.employee
        }));
        
        setAttendanceRecords(records);
      } else {
        setError('Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setError('Failed to fetch attendance records');
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance statistics
  const fetchAttendanceStats = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${API_ENDPOINTS.attendance}/stats`, {
        params: { date: dateStr }
      });
      
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  // Load data when component mounts or date/filters change
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendanceRecords();
    fetchAttendanceStats();
  }, [selectedDate, searchTerm, selectedDepartment, selectedStatus]);

  // Get unique departments
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].sort(), 
    [employees]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-orange-100 text-orange-800';
      case 'Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return '✓';
      case 'Absent':
        return '✗';
      case 'Late':
        return '⏰';
      case 'Leave':
        return '🟡';
      default:
        return '?';
    }
  };

  const calculateHoursWorked = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return '0.0';
    
    const inTime = new Date(`2000-01-01T${clockIn}`);
    const outTime = new Date(`2000-01-01T${clockOut}`);
    const diffMs = outTime.getTime() - inTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    return hours.toFixed(1);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Clock In', 'Clock Out', 'Hours Worked', 'Status'];
    const csvContent = [
      headers.join(','),
      ...attendanceRecords.map(record => {
        const employee = record.employee;
        return [
          record.date,
          employee?.employeeId || '',
          employee?.name || '',
          employee?.department || '',
          record.clockIn || '',
          record.clockOut || '',
          calculateHoursWorked(record.clockIn || '', record.clockOut || ''),
          record.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Load and add logo
    const img = new Image();
    img.src = DairyLiciousLogo;
    
    img.onload = () => {
      // Add logo
      doc.addImage(img, 'JPEG', 14, 10, 30, 30);
      
      // Add company name and title
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Blue color
      doc.text('Dairy Licious', 50, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text('HR Manager', 50, 28);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Attendance Report', 50, 38);
      
      // Add date and summary
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Report Date: ${selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 14, 48);
      doc.text(`Total Records: ${attendanceRecords.length}`, 14, 54);
      
      // Add summary statistics
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary:', 14, 62);
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text(`Present: ${stats?.Present || 0}  |  Absent: ${stats?.Absent || 0}  |  Late: ${stats?.Late || 0}  |  On Leave: ${stats?.Leave || 0}`, 14, 68);
      
      // Prepare table data
      const tableData = attendanceRecords.map(record => {
        const employee = record.employee;
        return [
          employee?.employeeId || '',
          employee?.name || '',
          employee?.department || '',
          record.clockIn || '-',
          record.clockOut || '-',
          calculateHoursWorked(record.clockIn || '', record.clockOut || '') + 'h',
          record.status
        ];
      });
      
      // Add table
      autoTable(doc, {
        startY: 75,
        head: [['Employee ID', 'Name', 'Department', 'Clock In', 'Clock Out', 'Hours', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235], // Blue color
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [31, 41, 55], // Dark gray
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Light gray
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 22 },
          5: { cellWidth: 18 },
          6: { cellWidth: 22 },
        },
        didParseCell: function(data) {
          // Color code status column
          if (data.column.index === 6 && data.section === 'body') {
            const status = data.cell.text[0];
            if (status === 'Present') {
              data.cell.styles.textColor = [22, 163, 74]; // Green
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Absent') {
              data.cell.styles.textColor = [220, 38, 38]; // Red
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Late') {
              data.cell.styles.textColor = [234, 88, 12]; // Orange
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Leave') {
              data.cell.styles.textColor = [202, 138, 4]; // Yellow
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { top: 75, left: 14, right: 14 },
      });
      
      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Generated on ${new Date().toLocaleString()}`,
          14,
          doc.internal.pageSize.getHeight() - 10
        );
      }
      
      // Save the PDF
      doc.save(`attendance_report_${selectedDate.toISOString().split('T')[0]}.pdf`);
    };
    
    img.onerror = () => {
      // If image fails to load, generate PDF without logo
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text('Dairy Licious', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text('HR Manager', 14, 28);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Attendance Report', 14, 38);
      
      // Add table without logo
      const tableData = attendanceRecords.map(record => {
        const employee = record.employee;
        return [
          employee?.employeeId || '',
          employee?.name || '',
          employee?.department || '',
          record.clockIn || '-',
          record.clockOut || '-',
          calculateHoursWorked(record.clockIn || '', record.clockOut || '') + 'h',
          record.status
        ];
      });
      
      autoTable(doc, {
        startY: 50,
        head: [['Employee ID', 'Name', 'Department', 'Clock In', 'Clock Out', 'Hours', 'Status']],
        body: tableData,
      });
      
      doc.save(`attendance_report_${selectedDate.toISOString().split('T')[0]}.pdf`);
    };
  };

  const handleCorrection = async (correctedRecord: AttendanceRecord) => {
    try {
      // Update via API
      await axios.put(`${API_ENDPOINTS.attendance}/${correctedRecord.id}`, correctedRecord);
      
      // Refresh data
      fetchAttendanceRecords();
      fetchAttendanceStats();
      
      setShowCorrectionModal(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error updating attendance record:', error);
      setError('Failed to update attendance record');
    }
  };

  // Get missing entries (employees without attendance records for selected date)
  const missingEntries = employees.filter(emp => 
    emp.status === 'Active' && 
    !attendanceRecords.some(record => record.employeeId === emp.employeeId)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor and manage employee attendance records</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Date Navigation and View Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['daily', 'weekly', 'monthly'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDepartment('');
                      setSelectedStatus('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Missing Entries Alert */}
      {missingEntries.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Missing Attendance Entries</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {missingEntries.length} employees have no attendance records for {selectedDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <X className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700">Loading attendance data...</p>
          </div>
        </div>
      )}

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.Present || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {stats?.Absent || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Late</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.Late || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.Leave || 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Records</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {attendanceRecords.length} records for {selectedDate.toLocaleDateString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record, index) => {
                const employee = record.employee;
                if (!employee) return null;

                return (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockIn || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateHoursWorked(record.clockIn || '', record.clockOut || '')}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getStatusIcon(record.status)}</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowCorrectionModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {attendanceRecords.length === 0 && !loading && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records found for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCorrectionModal && selectedRecord && (
        <AttendanceCorrectionModal
          record={selectedRecord}
          employee={employees.find(emp => emp.id === selectedRecord.employeeId)!}
          onClose={() => {
            setShowCorrectionModal(false);
            setSelectedRecord(null);
          }}
          onSave={handleCorrection}
        />
      )}
    </div>
  );
};

export default AttendanceTracking;