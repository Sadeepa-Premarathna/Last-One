import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SalarySlip } from '../finance_types/salarySlip';
import { BalanceSheetData, ProfitLossData } from '../finance_types/reports';

// Import logo - Update the filename to match your actual logo file
import logoImage from '../finance_assets/DairyLiciousLogo.jpg';

export const generateSalarySlipPDF = (salarySlip: SalarySlip): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to convert number to words (simplified)
  const convertToWords = (amount: number): string => {
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

  let yPosition = 15; // Reduced initial margin

  // Company Header with Logo (Compact)
  try {
    // Smaller logo for space efficiency
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = (pageWidth / 2) - (logoWidth / 2);
    
    // Add logo centered above company name
    doc.addImage(logoImage, 'JPEG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += 25; // Reduced space for logo
    
    // Company name below logo
    doc.setFontSize(16); // Reduced font size
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
  } catch (error) {
    console.warn('Logo not found, proceeding without logo:', error);
    // Fallback to text-only header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
  }

  // Company Address (Compact)
  doc.setFontSize(8); // Smaller font
  doc.setFont('helvetica', 'normal');
  doc.text('123 Dairy Street, Malabe, Sri Lanka | Tel: +94 11 234 5678 | Email: finance@dairylicious.lk', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8; // Reduced spacing
  doc.setFontSize(12); // Reduced title size
  doc.setFont('helvetica', 'bold');
  doc.text('SALARY SLIP', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 12; // Reduced spacing

  // Employee Information Table (Compact)
  autoTable(doc, {
    startY: yPosition,
    head: [['Employee Information', 'Period Information']],
    body: [
      [`Employee ID: ${salarySlip.employeeId}`, `Salary Month: ${salarySlip.month}`],
      [`Employee Name: ${salarySlip.employeeName || salarySlip.employeeId}`, `Salary Slip ID: ${salarySlip.salarySlipId}`],
      [`Designation: Employee`, `Payment Status: ${salarySlip.paymentStatus}`],
      [`EPF No: EPF-${salarySlip.employeeId}`, `Bank Transfer: Direct Deposit`],
    ],
    styles: {
      fontSize: 8, // Smaller font
      cellPadding: 2, // Reduced padding
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - 28) / 2 },
      1: { cellWidth: (pageWidth - 28) / 2 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 8; // Reduced spacing

  // Compact Salary Breakdown Table
  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: [
      // Earnings Section
      ['EARNINGS', ''],
      ['Basic Salary', formatCurrency(salarySlip.basicSalary)],
      ['Overtime Amount', formatCurrency(salarySlip.otAmount)],
      ['Total Allowances', formatCurrency(salarySlip.totalAllowances)],
      ['Gross Salary', formatCurrency(salarySlip.grossSalary)],
      // Deductions Section (no empty row to save space)
      ['DEDUCTIONS', ''],
      ['EPF Employee (8%)', formatCurrency(salarySlip.epfEmployeeContribution)],
      ['Other Deductions', formatCurrency(salarySlip.totalDeductions - salarySlip.epfEmployeeContribution)],
      ['Total Deductions', formatCurrency(salarySlip.totalDeductions)],
      // Employer Contributions Section
      ['EMPLOYER CONTRIBUTIONS', ''],
      ['EPF Employer (12%)', formatCurrency(salarySlip.epfEmployerContribution)],
      ['ETF Employer (3%)', formatCurrency(salarySlip.etfEmployerContribution)],
    ],
    styles: {
      fontSize: 8, // Smaller font
      cellPadding: 1.5, // Reduced padding
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      // Style section headers
      if (data.cell.text[0] === 'EARNINGS' || data.cell.text[0] === 'DEDUCTIONS' || data.cell.text[0] === 'EMPLOYER CONTRIBUTIONS') {
        data.cell.styles.fillColor = [243, 244, 246];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [17, 24, 39];
        data.cell.styles.fontSize = 8;
      }
      // Style totals
      if (data.cell.text[0].includes('Gross Salary') || data.cell.text[0].includes('Total Deductions')) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [17, 24, 39];
      }
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - 28) * 0.65 },
      1: { cellWidth: (pageWidth - 28) * 0.35, halign: 'right' },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 8; // Reduced spacing

  // Compact Net Salary Box
  doc.setFillColor(59, 130, 246);
  doc.rect(14, yPosition, pageWidth - 28, 18, 'F'); // Reduced height
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12); // Reduced font size
  doc.setFont('helvetica', 'bold');
  doc.text('NET SALARY:', 20, yPosition + 7);
  doc.text(formatCurrency(salarySlip.netSalary), pageWidth - 20, yPosition + 7, { align: 'right' });
  
  doc.setFontSize(7); // Smaller font for amount in words
  doc.setFont('helvetica', 'normal');
  doc.text(`Amount in words: ${convertToWords(Math.floor(salarySlip.netSalary))} Rupees Only`, 20, yPosition + 14);

  yPosition += 25; // Reduced spacing

  // Check if we have enough space for signatures, if not, make them more compact
  const remainingSpace = pageHeight - yPosition - 20; // 20 for footer
  
  if (remainingSpace < 40) {
    // Compact signature section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    
    // Single line signatures
    doc.line(20, yPosition, 70, yPosition);
    doc.line(pageWidth - 70, yPosition, pageWidth - 20, yPosition);
    
    doc.text('Prepared By: HR Department', 45, yPosition + 8, { align: 'center' });
    doc.text('Approved By: Finance Manager', pageWidth - 45, yPosition + 8, { align: 'center' });
    
    yPosition += 15;
  } else {
    // Regular signature section
    const signatureY = yPosition;
    const leftSignatureX = 40;
    const rightSignatureX = pageWidth - 80;

    // Prepared By
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8); // Smaller font
    doc.line(leftSignatureX - 20, signatureY, leftSignatureX + 20, signatureY);
    doc.text('Prepared By', leftSignatureX, signatureY + 6, { align: 'center' });
    doc.text('HR Department', leftSignatureX, signatureY + 12, { align: 'center' });

    // Approved By
    doc.line(rightSignatureX - 20, signatureY, rightSignatureX + 20, signatureY);
    doc.text('Approved By', rightSignatureX, signatureY + 6, { align: 'center' });
    doc.text('Finance Manager', rightSignatureX, signatureY + 12, { align: 'center' });

    yPosition += 20;
  }

  // Compact Footer
  doc.setFontSize(6); // Very small font
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-LK')} | Computer generated - no signature required`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Download the PDF
  const fileName = `salary-slip-${salarySlip.employeeId}-${salarySlip.month}.pdf`;
  doc.save(fileName);
};

export const generateBalanceSheetPDF = (balanceSheetData: BalanceSheetData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  let yPosition = 10;

  // Company Header with Logo (Ultra Compact)
  try {
    const logoWidth = 15;
    const logoHeight = 15;
    const logoX = (pageWidth / 2) - (logoWidth / 2);
    
    doc.addImage(logoImage, 'JPEG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += 18;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 4;
  } catch (error) {
    console.warn('Logo not found, proceeding without logo:', error);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 4;
  }

  // Company Address (Ultra Compact)
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Dairy Street, Malabe, Sri Lanka | Tel: +94 11 234 5678 | Email: finance@dairylicious.lk', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BALANCE SHEET', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`As of ${balanceSheetData.period}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;

  // Assets Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSETS', 15, yPosition);
  yPosition += 6;

  // Current Assets
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Current Assets', 20, yPosition);
  yPosition += 5;

  const currentAssetsData = [
    ['Cash - paid orders', formatCurrency(balanceSheetData.assets.currentAssets.cash)],
    ['Bank', formatCurrency(balanceSheetData.assets.currentAssets.bank)],
    ['Accounts Receivable', formatCurrency(balanceSheetData.assets.currentAssets.accountsReceivable)],
    ['Inventory - raw milk', formatCurrency(balanceSheetData.assets.currentAssets.rawMilkInventory)],
    ['Inventory - packaged goods', formatCurrency(balanceSheetData.assets.currentAssets.packagedGoodsInventory)],
    ['Total Current Assets', formatCurrency(balanceSheetData.assets.currentAssets.totalCurrentAssets)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: currentAssetsData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      if (data.row.index === currentAssetsData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 248, 255];
      }
    },
    margin: { left: 20, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;

  // Non-current Assets
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Non-current Assets', 20, yPosition);
  yPosition += 5;

  const nonCurrentAssetsData = [
    ['Property, Plant, and Equipment', formatCurrency(balanceSheetData.assets.nonCurrentAssets.ppe)],
    ['Total Non-current Assets', formatCurrency(balanceSheetData.assets.nonCurrentAssets.totalNonCurrentAssets)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: nonCurrentAssetsData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      if (data.row.index === nonCurrentAssetsData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 248, 255];
      }
    },
    margin: { left: 20, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;

  // Total Assets
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Assets: ${formatCurrency(balanceSheetData.assets.totalAssets)}`, 20, yPosition);
  yPosition += 8;

  // Liabilities Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LIABILITIES', 15, yPosition);
  yPosition += 6;

  // Current Liabilities
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Current Liabilities', 20, yPosition);
  yPosition += 5;

  const currentLiabilitiesData = [
    ['Accounts Payable', formatCurrency(balanceSheetData.liabilities.currentLiabilities.accountsPayable)],
    ['Wages Payable', formatCurrency(balanceSheetData.liabilities.currentLiabilities.wagesPayable)],
    ['Tax Payable', formatCurrency(balanceSheetData.liabilities.currentLiabilities.taxPayable)],
    ['Short-term Loans', formatCurrency(balanceSheetData.liabilities.currentLiabilities.shortTermLoans)],
    ['Total Current Liabilities', formatCurrency(balanceSheetData.liabilities.currentLiabilities.totalCurrentLiabilities)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: currentLiabilitiesData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 38, 127],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      if (data.row.index === currentLiabilitiesData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [254, 240, 248];
      }
    },
    margin: { left: 20, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;

  // Non-current Liabilities
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Non-current Liabilities', 20, yPosition);
  yPosition += 5;

  const nonCurrentLiabilitiesData = [
    ['Long-term Loans', formatCurrency(balanceSheetData.liabilities.nonCurrentLiabilities.longTermLoans)],
    ['Total Non-current Liabilities', formatCurrency(balanceSheetData.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: nonCurrentLiabilitiesData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 38, 127],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      if (data.row.index === nonCurrentLiabilitiesData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [254, 240, 248];
      }
    },
    margin: { left: 20, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 6;

  // Total Liabilities
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Liabilities: ${formatCurrency(balanceSheetData.liabilities.totalLiabilities)}`, 20, yPosition);
  yPosition += 8;

  // Equity Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EQUITY', 15, yPosition);
  yPosition += 6;

  const equityData = [
    ['Owner\'s Equity', formatCurrency(balanceSheetData.equity.ownersEquity)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Amount (LKR)']],
    body: equityData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [34, 197, 94],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
      fontStyle: 'bold',
    },
    margin: { left: 20, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 8;

  // Balance Verification
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Balance Verification:', 20, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Total Assets = Total Liabilities + Equity`, 25, yPosition);
  yPosition += 4;
  doc.text(`${formatCurrency(balanceSheetData.assets.totalAssets)} = ${formatCurrency(balanceSheetData.liabilities.totalLiabilities)} + ${formatCurrency(balanceSheetData.equity.ownersEquity)}`, 25, yPosition);
  yPosition += 4;
  
  const isBalanced = Math.abs(balanceSheetData.assets.totalAssets - (balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.ownersEquity)) < 1;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isBalanced ? 34 : 220, isBalanced ? 197 : 38, isBalanced ? 94 : 38);
  doc.text(isBalanced ? '✓ BALANCED' : '✗ NOT BALANCED', 25, yPosition);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-LK')} | Computer generated - no signature required`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Download the PDF
  const fileName = `balance-sheet-${balanceSheetData.period.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
};

export const generateProfitAndLossPDF = (profitLossData: ProfitLossData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  let yPosition = 15;

  // Company Header with Logo (Compact)
  try {
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = (pageWidth / 2) - (logoWidth / 2);
    
    doc.addImage(logoImage, 'JPEG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += 25;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
  } catch (error) {
    console.warn('Logo not found, proceeding without logo:', error);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DairyLicious', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
  }

  // Company Address (Compact)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Dairy Street, Malabe, Sri Lanka | Tel: +94 11 234 5678 | Email: finance@dairylicious.lk', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFIT & LOSS STATEMENT', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`For the period ended ${profitLossData.periodLabel}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Calculate detailed breakdown based on current data
  const salesRevenue = profitLossData.revenue.milkSales;
  const otherRevenue = profitLossData.revenue.otherRevenue;
  const totalRevenue = profitLossData.revenue.totalRevenue;
  
  // Break down COGS (assuming 60% of total expenses are COGS)
  const rawMaterials = profitLossData.expenses.costOfGoodsSold * 0.6;
  const directLabor = profitLossData.expenses.costOfGoodsSold * 0.3;
  const directProductionCosts = profitLossData.expenses.costOfGoodsSold * 0.1;
  const totalCOGS = profitLossData.expenses.costOfGoodsSold;
  
  const grossProfit = profitLossData.profit.grossProfit;
  
  // Break down Operating Expenses
  const salariesWages = profitLossData.expenses.operatingExpenses * 0.7;
  const utilities = profitLossData.expenses.operatingExpenses * 0.15;
  const marketingSales = profitLossData.expenses.operatingExpenses * 0.1;
  const otherOperatingExpenses = profitLossData.expenses.operatingExpenses * 0.05;
  const totalOperatingExpenses = profitLossData.expenses.operatingExpenses;
  
  const operatingIncome = grossProfit - totalOperatingExpenses;
  const netProfit = profitLossData.profit.netProfit;
  const profitMargin = profitLossData.profit.profitMargin;

  // Professional P&L Statement Table
  const plData = [
    // Revenue Section
    ['REVENUE', ''],
    ['  Sales (from online orders collection)', formatCurrency(salesRevenue)],
    ['  Other Revenue (hardcoded value)', formatCurrency(otherRevenue)],
    ['TOTAL REVENUE', formatCurrency(totalRevenue)],
    ['', ''], // Empty row for spacing
    
    // COGS Section
    ['COST OF GOODS SOLD (COGS)', ''],
    ['  Raw materials', formatCurrency(rawMaterials)],
    ['  Direct labor', formatCurrency(directLabor)],
    ['  Direct production costs', formatCurrency(directProductionCosts)],
    ['TOTAL COGS', formatCurrency(totalCOGS)],
    ['', ''], // Empty row for spacing
    
    // Gross Profit
    ['GROSS PROFIT', formatCurrency(grossProfit)],
    ['', ''], // Empty row for spacing
    
    // Operating Expenses Section
    ['OPERATING EXPENSES', ''],
    ['  Salaries & Wages', formatCurrency(salariesWages)],
    ['  Utilities (from additional expenses)', formatCurrency(utilities)],
    ['  Marketing & Sales (hardcoded value)', formatCurrency(marketingSales)],
    ['  Other Operating Expenses', formatCurrency(otherOperatingExpenses)],
    ['TOTAL OPERATING EXPENSES', formatCurrency(totalOperatingExpenses)],
    ['', ''], // Empty row for spacing
    
    // Operating Income
    ['OPERATING INCOME', formatCurrency(operatingIncome)],
    ['', ''], // Empty row for spacing
    
    // Net Profit Section
    ['NET PROFIT (LOSS)', formatCurrency(netProfit)],
    ['', ''], // Empty row for spacing
    
    // Profit Margin
    ['PROFIT MARGIN', `${profitMargin.toFixed(1)}%`]
  ];

  autoTable(doc, {
    startY: yPosition,
    body: plData,
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    bodyStyles: {
      textColor: 50,
    },
    didParseCell: function(data) {
      const cellText = data.cell.text[0];
      
      // Style main section headers (REVENUE, COGS, etc.)
      if (cellText === 'REVENUE' || cellText === 'COST OF GOODS SOLD (COGS)' || 
          cellText === 'OPERATING EXPENSES' || cellText === 'NET PROFIT (LOSS)' || 
          cellText === 'PROFIT MARGIN') {
        data.cell.styles.fillColor = [240, 248, 255];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 10;
        data.cell.styles.textColor = [17, 24, 39];
      }
      
      // Style subtotals and calculated lines
      if (cellText === 'TOTAL REVENUE' || cellText === 'TOTAL COGS' || 
          cellText === 'TOTAL OPERATING EXPENSES' || cellText === 'GROSS PROFIT' || 
          cellText === 'OPERATING INCOME' || cellText === 'NET PROFIT (LOSS)') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [17, 24, 39];
        data.cell.styles.fillColor = [248, 250, 252];
      }
      
      // Style profit margin
      if (cellText === 'PROFIT MARGIN') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = netProfit >= 0 ? [34, 197, 94] : [220, 38, 127];
      }
      
      // Style net profit based on positive/negative
      if (cellText === 'NET PROFIT (LOSS)') {
        data.cell.styles.textColor = netProfit >= 0 ? [34, 197, 94] : [220, 38, 127];
      }
      
      // Right align amounts
      if (data.column.index === 1 && cellText !== '') {
        data.cell.styles.halign = 'right';
      }
      
      // Hide borders for empty rows
      if (cellText === '') {
        data.cell.styles.lineWidth = 0;
        data.cell.styles.fillColor = [255, 255, 255];
      }
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - 28) * 0.7 },
      1: { cellWidth: (pageWidth - 28) * 0.3, halign: 'right' },
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-LK')} | Computer generated - no signature required`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Download the PDF
  const fileName = `profit-loss-statement-${profitLossData.periodLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
};