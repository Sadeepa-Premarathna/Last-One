import React, { useState } from 'react';
import { FileText, Download, Loader2, BarChart3 } from 'lucide-react';
import { ReportFilters, BalanceSheetData, ProfitLossData, ReportMetadata } from '../finance_types/reports';
import { reportService } from '../finance_services/reportService';
import ReportPreview from './finance_ReportPreview';
import Button from './ui/Button';
import Select from './ui/Select';
import Toast from './ui/Toast';
import { generateBalanceSheetPDF, generateProfitAndLossPDF } from '../finance_utils/pdfGenerator';

// Import for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ReportGeneration: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    timePeriod: 'Monthly',
    reportType: 'Balance Sheet',
    selectedMonth: new Date().getMonth() + 1 // Current month (1-12)
  });
  
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null);
  const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const timePeriodOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  const reportTypeOptions = [
    { value: 'Balance Sheet', label: 'Balance Sheet' },
    { value: 'Profit & Loss Statement', label: 'Profit & Loss Statement' }
  ];

  // Generate month options (current year, not future months)
  const getMonthOptions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return monthNames.slice(0, currentMonth).map((name, index) => ({
      value: (index + 1).toString(),
      label: `${name} ${currentYear}`
    }));
  };

  const monthOptions = getMonthOptions();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const handleTimePeriodChange = (value: string) => {
    const newFilters = { ...filters, timePeriod: value as 'Monthly' | 'Yearly' };
    
    // If switching to Monthly, set to current month
    if (value === 'Monthly') {
      newFilters.selectedMonth = new Date().getMonth() + 1;
    } else {
      // If switching to Yearly, remove selectedMonth
      delete newFilters.selectedMonth;
    }
    
    setFilters(newFilters);
  };

  const generateReport = async () => {
    // Validate that month is selected when time period is Monthly
    if (filters.timePeriod === 'Monthly' && !filters.selectedMonth) {
      showToast('Please select a month for monthly reports', 'error');
      return;
    }

    setLoading(true);
    setHasGenerated(false);
    
    try {
      if (filters.reportType === 'Balance Sheet') {
        const data = await reportService.generateBalanceSheetReport(filters);
        setBalanceSheetData(data);
        setProfitLossData(null);
      } else if (filters.reportType === 'Profit & Loss Statement') {
        const data = await reportService.generateProfitLossReport(filters);
        setProfitLossData(data);
        setBalanceSheetData(null);
      }
      
      setHasGenerated(true);
      showToast('Report generated successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      showToast(errorMessage, 'error');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportMetadata = (): ReportMetadata => {
    const now = new Date();
    let periodLabel: string;
    
    if (filters.reportType === 'Balance Sheet' && balanceSheetData) {
      periodLabel = balanceSheetData.period;
    } else if (filters.reportType === 'Profit & Loss Statement' && profitLossData) {
      periodLabel = profitLossData.periodLabel;
    } else {
      periodLabel = filters.timePeriod;
    }
    
    return {
      companyName: 'DairyLicious',
      reportTitle: `${filters.reportType} Report`,
      timePeriod: periodLabel,
      generatedDate: now.toLocaleDateString(),
      generatedTime: now.toLocaleTimeString()
    };
  };

  const getFileName = (extension: string): string => {
    const metadata = getReportMetadata();
    const sanitizedPeriod = metadata.timePeriod.replace(/[^a-zA-Z0-9]/g, '_');
    return `${metadata.companyName}_${filters.reportType}_${sanitizedPeriod}.${extension}`;
  };

  const exportToPDF = async () => {
    if (!hasGenerated) return;
    
    setExporting(true);
    
    try {
      // Use specialized PDF generator for Balance Sheet
      if (filters.reportType === 'Balance Sheet' && balanceSheetData) {
        generateBalanceSheetPDF(balanceSheetData);
        showToast('Balance Sheet PDF exported successfully', 'success');
        return;
      }
      
      // Use specialized PDF generator for Profit & Loss Statement
      if (filters.reportType === 'Profit & Loss Statement' && profitLossData) {
        generateProfitAndLossPDF(profitLossData);
        showToast('Profit & Loss Statement PDF exported successfully', 'success');
        return;
      }

      // Use html2canvas for other report types
      const element = document.getElementById('report-preview');
      if (!element) throw new Error('Report preview not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(getFileName('pdf'));
      showToast('PDF exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export PDF', 'error');
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    if (!hasGenerated) return;
    
    setExporting(true);
    
    try {
      const metadata = getReportMetadata();
      const workbook = new ExcelJS.Workbook();

      const addSheetWithData = (title: string, rows: (string | number)[][]) => {
        const sheet = workbook.addWorksheet(title);
        rows.forEach((row) => {
          sheet.addRow(row);
        });
        // Basic styling: bold header rows
        const headerRows = [1, 5];
        headerRows.forEach((rowIndex) => {
          const row = sheet.getRow(rowIndex);
          row.font = { bold: true };
        });
        // Compute column widths without relying on eachCell typing
        const columnCount = sheet.columnCount;
        for (let c = 1; c <= columnCount; c++) {
          const column = sheet.getColumn(c);
          let maxLength = 10;
          for (let r = 1; r <= sheet.rowCount; r++) {
            const cell = sheet.getCell(r, c);
            const val = (cell && cell.value) as string | number | null;
            const len = val ? String(val).length : 0;
            if (len > maxLength) maxLength = len;
          }
          column.width = Math.min(60, Math.max(12, maxLength + 2));
        }
      };

      if (filters.reportType === 'Balance Sheet' && balanceSheetData) {
        const rows: (string | number)[][] = [
          ['DairyLicious - Balance Sheet Report'],
          [`Period: ${metadata.timePeriod}`],
          [`Generated: ${metadata.generatedDate} at ${metadata.generatedTime}`],
          [],
          ['Assets', 'Amount'],
          ['Current Assets', balanceSheetData.assets.currentAssets.totalCurrentAssets],
          ['Non-current Assets', balanceSheetData.assets.nonCurrentAssets.totalNonCurrentAssets],
          ['Total Assets', balanceSheetData.assets.totalAssets],
          [],
          ['Liabilities', 'Amount'],
          ['Current Liabilities', balanceSheetData.liabilities.currentLiabilities.totalCurrentLiabilities],
          ['Non-current Liabilities', balanceSheetData.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities],
          ['Total Liabilities', balanceSheetData.liabilities.totalLiabilities],
          [],
          ['Equity', 'Amount'],
          ['Owner Equity', balanceSheetData.equity.ownersEquity]
        ];
        addSheetWithData('Balance Sheet Report', rows);
      } else if (filters.reportType === 'Profit & Loss Statement' && profitLossData) {
        // Calculate detailed breakdown for Excel export
        const salesRevenue = profitLossData.revenue.milkSales;
        const otherRevenue = profitLossData.revenue.otherRevenue;
        const totalRevenue = profitLossData.revenue.totalRevenue;
        
        const rawMaterials = profitLossData.expenses.costOfGoodsSold * 0.6;
        const directLabor = profitLossData.expenses.costOfGoodsSold * 0.3;
        const directProductionCosts = profitLossData.expenses.costOfGoodsSold * 0.1;
        const totalCOGS = profitLossData.expenses.costOfGoodsSold;
        
        const grossProfit = profitLossData.profit.grossProfit;
        
        const salariesWages = profitLossData.expenses.operatingExpenses * 0.7;
        const utilities = profitLossData.expenses.operatingExpenses * 0.15;
        const marketingSales = profitLossData.expenses.operatingExpenses * 0.1;
        const otherOperatingExpenses = profitLossData.expenses.operatingExpenses * 0.05;
        const totalOperatingExpenses = profitLossData.expenses.operatingExpenses;
        
        const operatingIncome = grossProfit - totalOperatingExpenses;
        const netProfit = profitLossData.profit.netProfit;
        const profitMargin = profitLossData.profit.profitMargin;

        const rows: (string | number)[][] = [
          ['DairyLicious - Profit & Loss Statement'],
          [`Period: ${metadata.timePeriod}`],
          [`Generated: ${metadata.generatedDate} at ${metadata.generatedTime}`],
          [],
          ['REVENUE (Money coming in)', ''],
          ['Sales (from online orders collection)', salesRevenue],
          ['Other Revenue (hardcoded value)', otherRevenue],
          ['TOTAL REVENUE', totalRevenue],
          [],
          ['COST OF GOODS SOLD (COGS) (Cost of making products)', ''],
          ['Raw materials', rawMaterials],
          ['Direct labor', directLabor],
          ['Direct production costs', directProductionCosts],
          ['TOTAL COGS', totalCOGS],
          [],
          ['GROSS PROFIT = Revenue – COGS', grossProfit],
          [],
          ['OPERATING EXPENSES (Cost of running the business)', ''],
          ['Salaries & Wages', salariesWages],
          ['Utilities (fetched from additional expenses)', utilities],
          ['Marketing & Sales (hardcoded value)', marketingSales],
          ['Other Operating Expenses', otherOperatingExpenses],
          ['TOTAL OPERATING EXPENSES', totalOperatingExpenses],
          [],
          ['OPERATING INCOME = Gross Profit – Operating Expenses', operatingIncome],
          [],
          ['NET PROFIT (Final bottom line)', ''],
          ['Net Profit (Loss) = Operating Income – Other Expenses', netProfit],
          [],
          ['PROFIT MARGIN (Efficiency measure)', ''],
          ['Profit Margin = (Net Profit ÷ Revenue) × 100', `${profitMargin.toFixed(1)}%`]
        ];
        addSheetWithData('Profit & Loss Statement', rows);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, getFileName('xlsx'));
      showToast('Excel file exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export Excel file', 'error');
      console.error('Error exporting Excel:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Report Generation
        </h1>
        <p className="text-gray-600">
          Generate professional financial reports including balance sheets and profit & loss statements
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Time Period"
            options={timePeriodOptions}
            value={filters.timePeriod}
            onChange={(e) => handleTimePeriodChange(e.target.value)}
          />
          
          <Select
            label="Report Type"
            options={reportTypeOptions}
            value={filters.reportType}
            onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value as ReportFilters['reportType'] }))}
          />

          {filters.timePeriod === 'Monthly' && (
            <Select
              label="Select Month"
              options={monthOptions}
              value={filters.selectedMonth?.toString() || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedMonth: parseInt(e.target.value) }))}
            />
          )}
          
          <div className="flex items-end">
            <Button 
              onClick={generateReport} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Report Type Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            {filters.reportType === 'Balance Sheet' ? (
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
            ) : (
              <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-medium text-gray-800 mb-1">
                {filters.reportType} Report
              </h3>
              <p className="text-sm text-gray-600">
                {filters.reportType === 'Balance Sheet' 
                  ? 'Complete balance sheet showing assets, liabilities, and equity position of the company.'
                  : 'Comprehensive profit & loss statement detailing revenue, expenses, and net profit for the period.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {hasGenerated && (balanceSheetData || profitLossData) && (
        <>
          <ReportPreview
            reportType={filters.reportType}
            balanceSheetData={balanceSheetData ?? undefined}
            profitLossData={profitLossData ?? undefined}
            metadata={getReportMetadata()}
          />

          {/* Export Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button 
                onClick={exportToPDF}
                disabled={exporting}
                variant="outline"
                className="flex-1"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Export PDF
              </Button>
              
              <Button 
                onClick={exportToExcel}
                disabled={exporting}
                variant="outline"
                className="flex-1"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Excel
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Report generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </>
      )}

      {/* Empty State */}
      {!hasGenerated && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Report Generated</h3>
          <p className="text-gray-600 mb-4">
            Select your preferred time period and report type, then click "Generate Report" to create a professional report.
          </p>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default ReportGeneration;

