// Driver Report Generator
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addReportHeader,
  addReportFooter,
  getTableStyles,
  addSummarySection
} from './reportGenerator';
import { Driver } from '../types';

export const generateDriverReport = (
  drivers: Driver[],
  reportType: 'all' | 'active' | 'inactive' = 'all',
  logoDataUrl?: string
) => {
  const doc = new jsPDF();

  // Filter drivers based on report type
  let filteredDrivers = drivers;
  if (reportType === 'active') {
    filteredDrivers = drivers.filter(d => d.status === 'Active');
  } else if (reportType === 'inactive') {
    filteredDrivers = drivers.filter(d => d.status === 'Inactive' || d.status === 'On Leave');
  }

  // Add header
  const reportTitle = reportType === 'all' 
    ? 'Drivers Report - Complete List'
    : reportType === 'active'
    ? 'Drivers Report - Active Drivers'
    : 'Drivers Report - Inactive Drivers';

  let currentY = addReportHeader(doc, reportTitle, logoDataUrl);

  // Add summary
  const summaryData = [
    { label: 'Total Drivers', value: filteredDrivers.length },
    { label: 'Active', value: filteredDrivers.filter(d => d.status === 'Active').length },
    { label: 'Inactive', value: filteredDrivers.filter(d => d.status === 'Inactive').length },
    { label: 'On Leave', value: filteredDrivers.filter(d => d.status === 'On Leave').length }
  ];

  currentY = addSummarySection(doc, currentY + 5, summaryData);

  // Prepare table data
  const tableData = filteredDrivers.map((driver, index) => [
    index + 1,
    `${driver.firstName} ${driver.lastName}`,
    driver.licenseNumber || 'N/A',
    driver.contactNumber || 'N/A',
    driver.vehicleNumber || 'N/A',
    driver.status || 'N/A'
  ]);

  // Add table
  const tableStyles = getTableStyles();
  autoTable(doc, {
    head: [['#', 'Driver Name', 'License No.', 'Phone', 'Vehicle No.', 'Status']],
    body: tableData,
    startY: currentY + 5,
    theme: tableStyles.theme,
    headStyles: {
      fillColor: [39, 174, 96] as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontSize: tableStyles.headStyles.fontSize,
      fontStyle: 'bold' as const,
      halign: tableStyles.headStyles.halign
    },
    bodyStyles: {
      textColor: [44, 62, 80] as [number, number, number],
      fontSize: tableStyles.bodyStyles.fontSize
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] as [number, number, number]
    },
    margin: tableStyles.margin,
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25, halign: 'center' }
    },
    didDrawPage: function(data: any) {
      // Add footer on each page
      addReportFooter(doc, data.pageNumber, data.pageCount, data.pageNumber === data.pageCount);
    }
  });

  // Save the PDF
  const fileName = `Drivers_Report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateDriverDetailReport = (driver: Driver, logoDataUrl?: string) => {
  const doc = new jsPDF();

  // Add header
  let currentY = addReportHeader(doc, 'Driver Details Report', logoDataUrl);

  // Driver Information Section
  currentY += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('Personal Information', 15, currentY);
  currentY += 8;

  const addressStr = driver.address 
    ? `${driver.address.street}, ${driver.address.city}, ${driver.address.district}`
    : 'N/A';

  const personalInfo = [
    ['Driver ID:', driver.driverId || 'N/A'],
    ['Full Name:', `${driver.firstName} ${driver.lastName}`],
    ['Email:', driver.email || 'N/A'],
    ['Phone:', driver.contactNumber || 'N/A'],
    ['Address:', addressStr],
    ['License Number:', driver.licenseNumber || 'N/A'],
    ['Status:', driver.status || 'N/A']
  ];

  personalInfo.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 128, 150);
    doc.text(label, 20, currentY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text(value, 70, currentY);
    
    currentY += 7;
  });

  // Vehicle Information
  currentY += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('Vehicle Information', 15, currentY);
  currentY += 8;

  const vehicleInfo = [
    ['Vehicle Number:', driver.vehicleNumber || 'N/A'],
    ['Vehicle Type:', driver.vehicleType || 'N/A']
  ];

  vehicleInfo.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(113, 128, 150);
    doc.text(label, 20, currentY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text(value, 70, currentY);
    
    currentY += 7;
  });

  // Add footer with signature space
  addReportFooter(doc, 1, 1, true);

  // Save the PDF
  const fileName = `Driver_${driver.driverId}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const driverReportGenerator = {
  generateDriverReport,
  generateDriverDetailReport
};

export default driverReportGenerator;
