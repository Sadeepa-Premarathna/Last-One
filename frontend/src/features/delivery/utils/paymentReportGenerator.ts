// Payment Report Generator
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addReportHeader,
  addReportFooter,
  formatDate,
  formatCurrency,
  addSummarySection
} from './reportGenerator';
import { Payment } from '../types';

export const generatePaymentReport = (
  payments: Payment[],
  filterStatus?: string,
  logoDataUrl?: string
) => {
  const doc = new jsPDF();

  // Filter payments if needed
  const filteredPayments = filterStatus
    ? payments.filter(p => p.paymentStatus === filterStatus)
    : payments;

  // Add header
  const reportTitle = filterStatus
    ? `Payment Report - ${filterStatus} Payments`
    : 'Payment Report - All Payments';
  
  const currentY = addReportHeader(doc, reportTitle, logoDataUrl);

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = filteredPayments.filter(p => p.paymentStatus === 'Completed');
  const completedAmount = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPayments = filteredPayments.filter(p => p.paymentStatus === 'Pending');
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Add summary
  const summaryData = [
    { label: 'Total Payments', value: filteredPayments.length },
    { label: 'Total Amount', value: formatCurrency(totalAmount) },
    { label: 'Completed', value: `${completedPayments.length} (${formatCurrency(completedAmount)})` },
    { label: 'Pending', value: `${pendingPayments.length} (${formatCurrency(pendingAmount)})` }
  ];

  const summaryEndY = addSummarySection(doc, currentY + 5, summaryData);

  // Prepare table data
  const tableData = filteredPayments.map((payment, index) => [
    index + 1,
    payment.paymentId || 'N/A',
    formatDate(payment.paymentDate),
    payment.paymentMethod || 'N/A',
    formatCurrency(payment.amount || 0),
    payment.paymentStatus || 'N/A'
  ]);

  // Add table
  autoTable(doc, {
    head: [['#', 'Payment ID', 'Date', 'Method', 'Amount', 'Status']],
    body: tableData,
    startY: summaryEndY + 5,
    theme: 'grid',
    headStyles: {
      fillColor: [39, 174, 96] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [44, 62, 80] as [number, number, number]
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250] as [number, number, number]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35, halign: 'right' },
      5: { cellWidth: 30, halign: 'center' }
    },
    didDrawPage: function(data) {
      const pageCount = (doc as any).internal.getNumberOfPages();
      addReportFooter(doc, data.pageNumber, pageCount, data.pageNumber === pageCount);
    }
  });

  // Save the PDF
  const fileName = `Payment_Report_${filterStatus || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const paymentReportGenerator = {
  generatePaymentReport
};

export default paymentReportGenerator;
