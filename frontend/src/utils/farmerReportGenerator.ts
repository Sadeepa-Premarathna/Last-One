// Farmer Report Generator
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addReportHeader,
  addReportFooter,
  addSummarySection
} from './reportGenerator';
import { Farmer } from '../types';

export const generateFarmerReport = (
  farmers: Farmer[],
  logoDataUrl?: string
) => {
  const doc = new jsPDF();

  // Add header
  const currentY = addReportHeader(doc, 'Farmers Report - Complete List', logoDataUrl);

  // Add summary
  const summaryData = [
    { label: 'Total Farmers', value: farmers.length }
  ];

  const summaryEndY = addSummarySection(doc, currentY + 5, summaryData);

  // Prepare table data
  const tableData = farmers.map((farmer, index) => {
    const addressStr = farmer.address 
      ? `${farmer.address.street}, ${farmer.address.city}`
      : 'N/A';
    
    return [
      index + 1,
      `${farmer.firstName} ${farmer.lastName}`,
      farmer.email || 'N/A',
      farmer.contactNumber || 'N/A',
      addressStr
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['#', 'Farmer Name', 'Email', 'Phone', 'Address']],
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
      1: { cellWidth: 45 },
      2: { cellWidth: 50 },
      3: { cellWidth: 35 },
      4: { cellWidth: 45 }
    },
    didDrawPage: function(data: any) {
      const totalPages = (doc as any).internal.getNumberOfPages();
      addReportFooter(doc, data.pageNumber, totalPages, data.pageNumber === totalPages);
    }
  });

  // Save the PDF
  const fileName = `Farmers_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const farmerReportGenerator = {
  generateFarmerReport
};

export default farmerReportGenerator;
