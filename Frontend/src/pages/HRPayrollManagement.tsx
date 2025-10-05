import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Calculator, 
  Lock, 
  Download, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  Clock,
  Users,
  FileText,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';
import { API_ENDPOINTS } from '../config/api';
import PayrollConfigModal from '../components/HRPayrollConfigModal';
import PayrollHistoryModal from '../components/HRPayrollHistoryModal';

interface PayrollRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  overtimeAmount: number;
  noPayDeductionAmount: number;
  status: 'unpaid' | 'paid' | 'processing';
  createdAt: string;
  updatedAt: string;
}

interface PayrollConfig {
  epfRate: number;
  etfRate: number;
  overtimeRate: number;
  standardHours: number;
  allowances: {
    transport: number;
    meal: number;
    medical: number;
  };
}

interface PayrollManagementProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onPayrollUpdate: (totalExpense: number) => void;
}

const PayrollManagement: React.FC<PayrollManagementProps> = ({ 
  employees, 
  attendanceRecords, 
  onPayrollUpdate 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'loaded'>('draft');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [payrollConfig, setPayrollConfig] = useState<PayrollConfig>({
    epfRate: 8.0, // 8% EPF
    etfRate: 3.0, // 3% ETF
    overtimeRate: 1.5, // 1.5x base rate
    standardHours: 8, // 8 hours per day
    allowances: {
      transport: 150,
      meal: 100,
      medical: 200
    }
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load payroll data from database
  const loadPayrollData = async () => {
    try {
      const monthParam = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      const response = await axios.get(`${API_ENDPOINTS.payroll}?month=${monthParam}`);
      
      if (response.data.success) {
        setPayrollRecords(response.data.data);
        setPayrollStatus('loaded');
        
        // Update dashboard payroll expense
        const totalExpense = response.data.data.reduce((sum: number, record: PayrollRecord) => 
          sum + (record.basicSalary + record.overtimeAmount - record.noPayDeductionAmount), 0
        );
        onPayrollUpdate(totalExpense);
      }
    } catch (error) {
      console.error('Error loading payroll data:', error);
      setErrors(['Error loading payroll data from database']);
    }
  };

  // Load payroll data when month/year changes
  useEffect(() => {
    loadPayrollData();
  }, [selectedMonth, selectedYear]);

  const generatePayroll = async () => {
    console.log('🔄 Generate Payroll button clicked');
    setIsCalculating(true);
    setErrors([]);
    
    try {
      const monthParam = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`;
      console.log('📅 Generating payroll for month:', monthParam);
      console.log('🌐 API Endpoint:', `${API_ENDPOINTS.payroll}/generate/batch`);
      
      // Generate payroll for all active employees
      const response = await axios.post(`${API_ENDPOINTS.payroll}/generate/batch`, {
        month: monthParam
      });
      
      console.log('✅ Payroll API Response:', response.data);

      if (response.data.success) {
        const { summary, data } = response.data;
        
        if (summary.errors > 0) {
          const errorMessages = data.errors.map((err: any) => 
            `${err.employeeName}: ${err.message}`
          );
          setErrors(errorMessages);
        }
        
        if (summary.generated > 0 || summary.skipped > 0) {
          await loadPayrollData(); // Reload data to show updated records
        }
        
        // Show summary message
        const messages = [];
        if (summary.generated > 0) messages.push(`${summary.generated} payroll records generated`);
        if (summary.skipped > 0) messages.push(`${summary.skipped} already existed`);
        if (summary.errors > 0) messages.push(`${summary.errors} errors occurred`);
        
        if (messages.length > 0) {
          console.log('Payroll generation completed:', messages.join(', '));
        }
      }
    } catch (error: any) {
      console.error('❌ Error generating payroll:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error generating payroll';
      setErrors([errorMessage]);
    } finally {
      console.log('🔄 Setting isCalculating to false');
      setIsCalculating(false);
    }
  };

  const updatePayrollStatus = async (payrollId: string, newStatus: 'unpaid' | 'paid' | 'processing') => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.payroll}/${payrollId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        // Reload data to reflect the status change
        await loadPayrollData();
      }
    } catch (error) {
      console.error('Error updating payroll status:', error);
      setErrors(['Error updating payroll status']);
    }
  };

  const exportPayroll = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate export time
      
      // Generate CSV for export
      const headers = [
        'Employee ID', 'Employee Name', 'Month', 'Basic Salary', 
        'Overtime Amount', 'No Pay Deduction', 'Net Payable'
      ];
      
      const csvContent = [
        headers.join(','),
        ...payrollRecords.map(record => {
          const employee = employees.find(emp => emp.id === record.employeeId);
          const netPayable = record.basicSalary + record.overtimeAmount - record.noPayDeductionAmount;
          return [
            employee?.employeeId || '',
            record.employeeName,
            record.month,
            record.basicSalary.toFixed(2),
            record.overtimeAmount.toFixed(2),
            record.noPayDeductionAmount.toFixed(2),
            netPayable.toFixed(2)
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll_${months[selectedMonth]}_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrors(['Error exporting payroll. Please try again.']);
    } finally {
      setIsExporting(false);
    }
  };

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + (record.basicSalary + record.overtimeAmount - record.noPayDeductionAmount), 0);
  const totalEmployees = payrollRecords.length;
  const totalOvertimeAmount = payrollRecords.reduce((sum, record) => sum + record.overtimeAmount, 0);
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.noPayDeductionAmount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'calculated':
        return 'bg-blue-100 text-blue-800';
      case 'finalized':
        return 'bg-yellow-100 text-yellow-800';
      case 'exported':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600 mt-1">Calculate and manage employee salaries and deductions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </button>
          </div>
        </div>

        {/* Month/Year Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payrollStatus)}`}>
                {payrollStatus.charAt(0).toUpperCase() + payrollStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">${totalPayroll.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Overtime Amount</p>
              <p className="text-2xl font-bold text-orange-600">${totalOvertimeAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              console.log('🖱️ Generate Payroll button clicked!');
              generatePayroll();
            }}
            disabled={isCalculating}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Calculator className="h-5 w-5" />
            <span>{isCalculating ? 'Generating...' : 'Generate Payroll'}</span>
          </button>

          <button
            onClick={exportPayroll}
            disabled={payrollRecords.length === 0 || isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="h-5 w-5" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}



      {/* Payroll Table */}
      {payrollRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Payroll Sheet - {months[selectedMonth]} {selectedYear}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {payrollRecords.length} employees processed
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
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No Pay Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Payable
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollRecords.map((record, index) => {
                  const netPayable = record.basicSalary + record.overtimeAmount - record.noPayDeductionAmount;

                  return (
                    <tr 
                      key={record._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {record.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.month}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.overtimeAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ${record.noPayDeductionAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'paid' ? 'bg-green-100 text-green-800' :
                          record.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${netPayable.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan={6}>
                    Total Payroll
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${totalPayroll.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {payrollRecords.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Calculated</h3>
          <p className="text-gray-600 mb-6">
            Click "Generate Payroll" to generate salary calculations for {months[selectedMonth]} {selectedYear}
          </p>
          <button
            onClick={() => {
              console.log('🖱️ Generate Payroll button (empty state) clicked!');
              generatePayroll();
            }}
            disabled={isCalculating}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium mx-auto"
          >
            <Calculator className="h-5 w-5" />
            <span>{isCalculating ? 'Generating...' : 'Generate Payroll'}</span>
          </button>
        </div>
      )}

      {/* Modals */}
      {showConfigModal && (
        <PayrollConfigModal
          config={payrollConfig}
          onClose={() => setShowConfigModal(false)}
          onSave={setPayrollConfig}
        />
      )}

      {showHistoryModal && (
        <PayrollHistoryModal
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
};

export default PayrollManagement;