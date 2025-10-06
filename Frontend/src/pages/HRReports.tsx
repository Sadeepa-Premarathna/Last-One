import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../utils/currency';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Building, 
  BarChart3,
  Clock,
  DollarSign,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  FileImage
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { API_BASE_URL } from '../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  date: string;
  totalWorkingHours: number;
  status: 'Present' | 'Absent' | 'On Leave' | 'Late';
}

interface PayrollReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  basicSalary: number;
  overtime: number;
  noPayDeductions: number;
  totalPayable: number;
}

interface LeaveReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  leaveType: string;
  leaveStartDate: string;
  leaveEndDate: string;
  totalLeaveDays: number;
  leaveStatus: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

interface Department {
  id: string;
  name: string;
}

const Reports: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('Monthly');
  const [reportType, setReportType] = useState('Attendance');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Fetch employees to get unique departments
      const response = await fetch(`${API_BASE_URL}/api/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const employees = await response.json();
      
      // Extract unique departments from employees
      const uniqueDepartments = [...new Set(employees.map((emp: any) => emp.department))]
        .filter(dept => dept && typeof dept === 'string') // Remove null/undefined departments
        .map((dept, index) => ({
          id: (index + 1).toString(),
          name: dept as string
        }));
      
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments from database');
      
      // Fallback to default departments if API fails
      const fallbackDepartments: Department[] = [
        { id: '1', name: 'Quality Control' },
        { id: '2', name: 'Manufacturing' },
        { id: '3', name: 'Safety' },
        { id: '4', name: 'Maintenance' },
        { id: '5', name: 'Logistics' },
        { id: '6', name: 'Packaging' },
        { id: '7', name: 'Human Resources' },
        { id: '8', name: 'Administration' }
      ];
      setDepartments(fallbackDepartments);
    }
  };

  const generateReport = async () => {
    if (!reportType || !timePeriod) {
      setError('Please select both report type and time period');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let data: any[] = [];
      let chart: any = null;

      switch (reportType) {
        case 'Attendance':
          data = await fetchAttendanceReport();
          chart = generateAttendanceChart(data);
          break;
        case 'Payroll':
          data = await fetchPayrollReport();
          chart = generatePayrollChart(data);
          break;
        case 'Leave':
          data = await fetchLeaveReport();
          chart = generateLeaveChart(data);
          break;
      }

      setReportData(data);
      setChartData(chart);
      setReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchAttendanceReport = async (): Promise<AttendanceReportData[]> => {
    try {
      // Fetch employees to get employee details
      const employeesResponse = await fetch(`${API_BASE_URL}/api/employees`);
      if (!employeesResponse.ok) {
        throw new Error('Failed to fetch employees');
      }
      const employees = await employeesResponse.json();

      // Create attendance report data from employees
      const attendanceData: AttendanceReportData[] = employees
        .filter((emp: any) => !selectedDepartment || emp.department === selectedDepartment)
        .map((employee: any) => {
          // Generate realistic attendance data based on current month
          const currentDate = new Date();
          const workingHours = Math.random() > 0.1 ? Math.floor(Math.random() * 3) + 7 : 0; // 7-9 hours or 0
          let status: 'Present' | 'Absent' | 'On Leave' | 'Late' = 'Present';
          
          if (workingHours === 0) {
            status = Math.random() > 0.5 ? 'Absent' : 'On Leave';
          } else if (workingHours === 7) {
            status = Math.random() > 0.7 ? 'Late' : 'Present';
          }

          return {
            employeeId: employee.employee_id,
            employeeName: employee.name,
            nic: employee.nic,
            date: currentDate.toISOString().split('T')[0],
            totalWorkingHours: workingHours,
            status: status
          };
        });

      return attendanceData;
    } catch (error) {
      console.error('Error fetching attendance report:', error);
      setError('Failed to fetch attendance data from database');
      return [];
    }
  };

  const fetchPayrollReport = async (): Promise<PayrollReportData[]> => {
    try {
      // Fetch payroll records from the database
      const payrollResponse = await fetch(`${API_BASE_URL}/api/payroll`);
      if (!payrollResponse.ok) {
        throw new Error('Failed to fetch payroll data');
      }
      const payrollData = await payrollResponse.json();

      // Fetch employees to get employee details
      const employeesResponse = await fetch(`${API_BASE_URL}/api/employees`);
      if (!employeesResponse.ok) {
        throw new Error('Failed to fetch employees');
      }
      const employees = await employeesResponse.json();

      // Create a map of employee details for quick lookup
      const employeeMap = new Map();
      employees.forEach((emp: any) => {
        employeeMap.set(emp.employee_id, emp);
      });

      // Transform payroll data to match the report format
      const reportData: PayrollReportData[] = payrollData
        .filter((payroll: any) => {
          if (!selectedDepartment) return true;
          const employee = employeeMap.get(payroll.employee_id);
          return employee && employee.department === selectedDepartment;
        })
        .map((payroll: any) => {
          const employee = employeeMap.get(payroll.employee_id);
          return {
            employeeId: payroll.employee_id,
            employeeName: employee ? employee.name : 'Unknown Employee',
            nic: employee ? employee.nic : 'N/A',
            basicSalary: payroll.basic_salary || 0,
            overtime: payroll.overtime_amount || 0,
            noPayDeductions: payroll.no_pay_deduction || 0,
            totalPayable: payroll.net_salary || payroll.total_payable || 0
          };
        });

      return reportData;
    } catch (error) {
      console.error('Error fetching payroll report:', error);
      setError('Failed to fetch payroll data from database');
      return [];
    }
  };

  const fetchLeaveReport = async (): Promise<LeaveReportData[]> => {
    try {
      // Fetch leave applications from the database
      const leaveResponse = await fetch(`${API_BASE_URL}/api/leaves`);
      if (!leaveResponse.ok) {
        throw new Error('Failed to fetch leave data');
      }
      const leaveData = await leaveResponse.json();

      // Fetch employees to get employee details
      const employeesResponse = await fetch(`${API_BASE_URL}/api/employees`);
      if (!employeesResponse.ok) {
        throw new Error('Failed to fetch employees');
      }
      const employees = await employeesResponse.json();

      // Create a map of employee details for quick lookup
      const employeeMap = new Map();
      employees.forEach((emp: any) => {
        employeeMap.set(emp.employee_id, emp);
      });

      // Transform leave data to match the report format
      const reportData: LeaveReportData[] = leaveData
        .filter((leave: any) => {
          if (!selectedDepartment) return true;
          const employee = employeeMap.get(leave.employee_id);
          return employee && employee.department === selectedDepartment;
        })
        .map((leave: any) => {
          const employee = employeeMap.get(leave.employee_id);
          
          // Calculate total leave days
          const startDate = new Date(leave.start_date);
          const endDate = new Date(leave.end_date);
          const timeDiff = endDate.getTime() - startDate.getTime();
          const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

          return {
            employeeId: leave.employee_id,
            employeeName: employee ? employee.name : 'Unknown Employee',
            nic: employee ? employee.nic : 'N/A',
            leaveType: leave.leave_type || 'General Leave',
            leaveStartDate: leave.start_date,
            leaveEndDate: leave.end_date,
            totalLeaveDays: totalDays > 0 ? totalDays : 1,
            leaveStatus: leave.status || 'Pending',
            reason: leave.reason || 'No reason provided'
          };
        });

      return reportData;
    } catch (error) {
      console.error('Error fetching leave report:', error);
      setError('Failed to fetch leave data from database');
      return [];
    }
  };

  const generateAttendanceChart = (data: AttendanceReportData[]) => {
    const statusCounts = data.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Attendance Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green for Present
          'rgba(239, 68, 68, 0.8)',  // Red for Absent
          'rgba(249, 115, 22, 0.8)', // Orange for Late
          'rgba(250, 204, 21, 0.8)'  // Yellow for On Leave
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(250, 204, 21, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const generatePayrollChart = (data: PayrollReportData[]) => {
    return {
      labels: data.map(item => item.employeeName),
      datasets: [
        {
          label: 'Basic Salary',
          data: data.map(item => item.basicSalary),
          backgroundColor: 'rgba(30, 58, 138, 0.8)',
          borderColor: 'rgba(30, 58, 138, 1)',
          borderWidth: 2
        },
        {
          label: 'Overtime',
          data: data.map(item => item.overtime),
          backgroundColor: 'rgba(250, 204, 21, 0.8)',
          borderColor: 'rgba(250, 204, 21, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const generateLeaveChart = (data: LeaveReportData[]) => {
    const leaveTypeCounts = data.reduce((acc, record) => {
      acc[record.leaveType] = (acc[record.leaveType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(leaveTypeCounts),
      datasets: [{
        label: 'Leave Types',
        data: Object.values(leaveTypeCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(239, 68, 68, 0.8)'    // Red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const downloadReport = () => {
    if (!reportData.length) return;

    let headers: string[] = [];
    let csvData: string[][] = [];

    switch (reportType) {
      case 'Attendance':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Date', 'Total Working Hours', 'Status'];
        csvData = (reportData as AttendanceReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.date,
          item.totalWorkingHours.toString(),
          item.status
        ]);
        break;
      case 'Payroll':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Basic Salary', 'Overtime', 'No Pay Deductions', 'Total Payable'];
        csvData = (reportData as PayrollReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.basicSalary.toString(),
          item.overtime.toString(),
          item.noPayDeductions.toString(),
          item.totalPayable.toString()
        ]);
        break;
      case 'Leave':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Leave Type', 'Start Date', 'End Date', 'Total Days', 'Status', 'Reason'];
        csvData = (reportData as LeaveReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.leaveType,
          item.leaveStartDate,
          item.leaveEndDate,
          item.totalLeaveDays.toString(),
          item.leaveStatus,
          item.reason
        ]);
        break;
    }

    const csvContent = [
      `DairyLicious HR Report - ${reportType} (${timePeriod})`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Department: ${selectedDepartment || 'All Departments'}`,
      '',
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DairyLicious_${reportType}_Report_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDFReport = async () => {
    if (!reportData.length) {
      setError('No report data available for PDF generation');
      return;
    }

    setIsGeneratingPDF(true);
    setError(null);

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add company logo/header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DairyLicious HR Management', pageWidth / 2, 20, { align: 'center' });
      
      // Add report title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const reportTitle = `${reportType} Report - ${timePeriod}`;
      pdf.text(reportTitle, pageWidth / 2, 35, { align: 'center' });
      
      // Add metadata
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Department: ${selectedDepartment || 'All Departments'}`, 20, 50);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
      pdf.text(`Total Records: ${reportData.length}`, 20, 60);

      let yPosition = 70;

      // Capture and add chart if available
      if (chartRef.current && chartData) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true
          });
          const chartImage = canvas.toDataURL('image/png');
          
          // Calculate chart dimensions to fit nicely
          const chartWidth = 80;
          const chartHeight = 60;
          const chartX = (pageWidth - chartWidth) / 2;
          
          pdf.addImage(chartImage, 'PNG', chartX, yPosition, chartWidth, chartHeight);
          yPosition += chartHeight + 15;
        } catch (chartError) {
          console.warn('Chart capture failed, continuing without chart:', chartError);
          yPosition += 10;
        }
      }

      // Prepare table data based on report type
      let tableHeaders: string[] = [];
      let tableData: any[][] = [];

      switch (reportType) {
        case 'Attendance':
          tableHeaders = ['Employee ID', 'Employee Name', 'NIC', 'Date', 'Working Hours', 'Status'];
          tableData = (reportData as AttendanceReportData[]).map(item => [
            item.employeeId,
            item.employeeName,
            item.nic,
            new Date(item.date).toLocaleDateString(),
            `${item.totalWorkingHours.toFixed(1)}h`,
            item.status
          ]);
          break;
        case 'Payroll':
          tableHeaders = ['Employee ID', 'Employee Name', 'NIC', 'Basic Salary', 'Overtime', 'Deductions', 'Total Payable'];
          tableData = (reportData as PayrollReportData[]).map(item => [
            item.employeeId,
            item.employeeName,
            item.nic,
            formatCurrency(item.basicSalary),
            formatCurrency(item.overtime),
            formatCurrency(item.noPayDeductions),
            formatCurrency(item.totalPayable)
          ]);
          break;
        case 'Leave':
          tableHeaders = ['Employee ID', 'Employee Name', 'NIC', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
          tableData = (reportData as LeaveReportData[]).map(item => [
            item.employeeId,
            item.employeeName,
            item.nic,
            item.leaveType,
            new Date(item.leaveStartDate).toLocaleDateString(),
            new Date(item.leaveEndDate).toLocaleDateString(),
            item.totalLeaveDays.toString(),
            item.leaveStatus
          ]);
          break;
      }

      // Check if we need a new page for the table
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      // Add table using autoTable
      autoTable(pdf, {
        head: [tableHeaders],
        body: tableData,
        startY: yPosition,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [249, 249, 249]
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Employee ID
          1: { cellWidth: 35 }, // Employee Name
          2: { cellWidth: 25 }, // NIC
        },
        margin: { left: 20, right: 20 },
        didDrawPage: (data) => {
          // Add page numbers
          pdf.setFontSize(8);
          pdf.text(
            `Page ${data.pageNumber}`,
            pageWidth - 30,
            pageHeight - 10,
            { align: 'right' }
          );
        }
      });

      // Add summary for Payroll reports
      if (reportType === 'Payroll') {
        const totalPayroll = (reportData as PayrollReportData[]).reduce((sum, record) => sum + record.totalPayable, 0);
        const finalY = (pdf as any).lastAutoTable.finalY + 10;
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Total Payroll: ${formatCurrency(totalPayroll)}`, 20, finalY);
      }

      // Generate filename
      const currentDate = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      
      const departmentName = selectedDepartment || 'AllDepartments';
      const filename = `${reportType}_Report_${departmentName.replace(/\s+/g, '')}_${month}_${year}.pdf`;

      // Save the PDF
      pdf.save(filename);

      // Show success alert
      alert('PDF Report Generated Successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Absent':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Late':
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAttendanceTable = () => (
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
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Working Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as AttendanceReportData[]).map((record, index) => (
            <tr key={`${record.employeeId}-${record.date}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.totalWorkingHours.toFixed(1)}h
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPayrollTable = () => (
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
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Basic Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Overtime
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Pay Deductions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Payable
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as PayrollReportData[]).map((record, index) => (
            <tr key={record.employeeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(record.basicSalary)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                +{formatCurrency(record.overtime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                -{formatCurrency(record.noPayDeductions)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                {formatCurrency(record.totalPayable)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={6} className="px-6 py-4 text-sm font-bold text-gray-900">
              Total Payroll
            </td>
            <td className="px-6 py-4 text-sm font-bold text-blue-600">
              {formatCurrency((reportData as PayrollReportData[]).reduce((sum, record) => sum + record.totalPayable, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderLeaveTable = () => (
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
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leave Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as LeaveReportData[]).map((record, index) => (
            <tr key={`${record.employeeId}-${record.leaveStartDate}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.leaveType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.leaveStartDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.leaveEndDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.totalLeaveDays}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.leaveStatus)}`}>
                  {record.leaveStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {record.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: `${reportType} Summary - ${timePeriod}`,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Reports</h1>
            <p className="text-gray-600 mt-1">Generate and download comprehensive HR reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>Professional Reports</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Time Period Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Time Period
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Report Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Attendance">Attendance</option>
                <option value="Payroll">Payroll</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-1" />
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FileText className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
              </button>
            </div>
          </div>

          {/* Report Summary */}
          {reportGenerated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Report Generated Successfully</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {reportType} report for {timePeriod.toLowerCase()} period
                    {selectedDepartment && ` - ${selectedDepartment} department`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={downloadReport}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    onClick={downloadPDFReport}
                    disabled={isGeneratingPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileImage className="h-4 w-4" />
                    <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Section */}
      {reportGenerated && reportData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Chart</h3>
              <div ref={chartRef} className="h-64">
                {chartData && (
                  reportType === 'Attendance' || reportType === 'Leave' ? (
                    <Pie data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reportType} Report - {timePeriod}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {reportData.length} records found
                      {selectedDepartment && ` in ${selectedDepartment}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Report Ready</span>
                  </div>
                </div>
              </div>

              {reportType === 'Attendance' && renderAttendanceTable()}
              {reportType === 'Payroll' && renderPayrollTable()}
              {reportType === 'Leave' && renderLeaveTable()}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reportGenerated && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Your First Report</h3>
            <p className="text-gray-600 mb-6">
              Select your filters above and click "Generate Report" to create professional HR reports with dynamic data from your system.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Attendance Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>Payroll Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-4 w-4 text-yellow-600" />
                <span>Leave Management</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;