import React from 'react';
import { X, Download, User, Calendar, Receipt, Building2 } from 'lucide-react';
import { SalarySlip } from '../finance_types/salarySlip';

interface SalarySlipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  salarySlip: SalarySlip | null;
  loading: boolean;
  onDownloadPDF: () => void;
}

const SalarySlipPreviewModal: React.FC<SalarySlipPreviewModalProps> = ({
  isOpen,
  onClose,
  salarySlip,
  loading,
  onDownloadPDF,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const convertToWords = (amount: number): string => {
    // Simple number to words conversion for demonstration
    // In a real application, you might want to use a library like 'number-to-words'
    if (amount === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (amount < 10) return ones[amount];
    if (amount < 20) return teens[amount - 10];
    if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 !== 0 ? ' ' + ones[amount % 10] : '');
    if (amount < 1000) return ones[Math.floor(amount / 100)] + ' Hundred' + (amount % 100 !== 0 ? ' ' + convertToWords(amount % 100) : '');
    if (amount < 100000) return convertToWords(Math.floor(amount / 1000)) + ' Thousand' + (amount % 1000 !== 0 ? ' ' + convertToWords(amount % 1000) : '');
    
    return 'Amount too large';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Salary Slip Preview</h2>
              <p className="text-sm text-gray-600">Review before downloading PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading salary slip details...</p>
              </div>
            </div>
          ) : salarySlip ? (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="w-8 h-8 text-blue-600 mr-2" />
                  <h1 className="text-2xl font-bold text-gray-900">DairyLicious</h1>
                </div>
                <p className="text-gray-600">123 Dairy Street, Colombo 07, Sri Lanka</p>
                <p className="text-gray-600">Tel: +94 11 234 5678 | Email: hr@dairylicious.lk</p>
                <h2 className="text-lg font-semibold text-gray-900 mt-4">SALARY SLIP</h2>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Employee Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium">{salarySlip.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Name:</span>
                      <span className="font-medium">{salarySlip.employeeName || salarySlip.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Designation:</span>
                      <span className="font-medium">Employee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EPF No:</span>
                      <span className="font-medium">EPF-{salarySlip.employeeId}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Period Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Month:</span>
                      <span className="font-medium">{salarySlip.month}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Slip ID:</span>
                      <span className="font-medium">{salarySlip.salarySlipId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${
                        salarySlip.paymentStatus === 'Paid' ? 'text-green-600' :
                        salarySlip.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {salarySlip.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Transfer:</span>
                      <span className="font-medium">Direct Deposit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Earnings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Basic Salary:</span>
                      <span className="font-medium">{formatCurrency(salarySlip.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Overtime Amount:</span>
                      <span className="font-medium">{formatCurrency(salarySlip.otAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Allowances:</span>
                      <span className="font-medium">{formatCurrency(salarySlip.totalAllowances)}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2 font-semibold">
                      <span className="text-green-800">Gross Salary:</span>
                      <span className="text-green-800">{formatCurrency(salarySlip.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Deductions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">EPF Employee (8%):</span>
                      <span className="font-medium">{formatCurrency(salarySlip.epfEmployeeContribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Other Deductions:</span>
                      <span className="font-medium">{formatCurrency(salarySlip.totalDeductions - salarySlip.epfEmployeeContribution)}</span>
                    </div>
                    <div className="flex justify-between border-t border-red-200 pt-2 font-semibold">
                      <span className="text-red-800">Total Deductions:</span>
                      <span className="text-red-800">{formatCurrency(salarySlip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employer Contributions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Employer Contributions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">EPF Employer (12%):</span>
                    <span className="font-medium">{formatCurrency(salarySlip.epfEmployerContribution)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">ETF Employer (3%):</span>
                    <span className="font-medium">{formatCurrency(salarySlip.etfEmployerContribution)}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-semibold">Net Salary:</span>
                  <span className="text-2xl font-bold">{formatCurrency(salarySlip.netSalary)}</span>
                </div>
                <div className="text-sm opacity-90">
                  <span>Amount in words: </span>
                  <span className="font-medium">{convertToWords(Math.floor(salarySlip.netSalary))} Rupees Only</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-2"></div>
                  <p className="text-sm font-medium">Prepared By</p>
                  <p className="text-xs text-gray-600">HR Department</p>
                </div>
                <div className="text-center">
                  <div className="h-16 border-b border-gray-300 mb-2"></div>
                  <p className="text-sm font-medium">Approved By</p>
                  <p className="text-xs text-gray-600">Finance Manager</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <X className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Failed to load salary slip details</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {salarySlip && !loading && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalarySlipPreviewModal;

