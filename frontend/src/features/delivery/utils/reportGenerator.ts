// Report Generation Utility for Dairy Shop Management System
import jsPDF from 'jspdf';

// Logo as base64 (this is a placeholder - we'll add the actual logo)
export const DAIRY_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Company information
export const COMPANY_INFO = {
  name: 'DAIRY LICIOUS',
  address: 'Your Address Here',
  phone: 'Your Phone Number',
  email: 'your@email.com',
  website: 'www.dairylicious.com'
};

// Add header with logo and company info
export const addReportHeader = (
  doc: jsPDF,
  reportTitle: string,
  logoDataUrl?: string
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add logo
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 15, 10, 40, 40);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  // Company name and info
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text(COMPANY_INFO.name, pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 128, 150);
  doc.text(COMPANY_INFO.address, pageWidth / 2, 28, { align: 'center' });
  doc.text(`${COMPANY_INFO.phone} | ${COMPANY_INFO.email}`, pageWidth / 2, 34, { align: 'center' });

  // Report title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(39, 174, 96);
  doc.text(reportTitle, pageWidth / 2, 50, { align: 'center' });

  // Line separator
  doc.setDrawColor(236, 240, 241);
  doc.setLineWidth(0.5);
  doc.line(15, 55, pageWidth - 15, 55);

  // Report date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 128, 150);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on: ${today}`, pageWidth - 15, 50, { align: 'right' });

  return 60; // Return Y position after header
};

// Add footer with page numbers and signature space
export const addReportFooter = (
  doc: jsPDF,
  currentPage: number,
  totalPages: number,
  includeSignature: boolean = true
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Signature spaces (if included)
  if (includeSignature && currentPage === totalPages) {
    const signatureY = pageHeight - 60;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 62, 80);

    // Prepared by
    doc.text('Prepared by:', 20, signatureY);
    doc.line(20, signatureY + 15, 90, signatureY + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 128, 150);
    doc.text('Name & Signature', 20, signatureY + 20);
    doc.text(`Date: __________`, 20, signatureY + 25);

    // Approved by
    doc.setFontSize(9);
    doc.setTextColor(44, 62, 80);
    doc.text('Approved by:', pageWidth - 90, signatureY);
    doc.line(pageWidth - 90, signatureY + 15, pageWidth - 20, signatureY + 15);
    doc.setFontSize(8);
    doc.setTextColor(113, 128, 150);
    doc.text('Name & Signature', pageWidth - 90, signatureY + 20);
    doc.text(`Date: __________`, pageWidth - 90, signatureY + 25);
  }

  // Footer line
  doc.setDrawColor(236, 240, 241);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 30, pageWidth - 15, pageHeight - 30);

  // Page number
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 128, 150);
  doc.text(
    `Page ${currentPage} of ${totalPages}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );

  // Company footer
  doc.text(
    `${COMPANY_INFO.name} - ${COMPANY_INFO.website}`,
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toFixed(2)}`;
};

// Format date
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Add summary section with autoTable
export const addSummarySection = (
  doc: jsPDF,
  startY: number,
  summaryData: { label: string; value: string | number }[]
) => {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text('Summary', 15, startY);

  const summaryRows = summaryData.map(item => [item.label, String(item.value)]);
  
  const autoTable = require('jspdf-autotable').default;
  autoTable(doc, {
    body: summaryRows,
    startY: startY + 5,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200] as [number, number, number],
      lineWidth: 0.5
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [113, 128, 150] as [number, number, number], cellWidth: 50 },
      1: { fontStyle: 'bold', textColor: [44, 62, 80] as [number, number, number], cellWidth: 30 }
    }
  });

  return (doc as any).lastAutoTable.finalY + 5;
};

// Table styles for reports
export const getTableStyles = () => {
  return {
    theme: 'grid' as const,
    headStyles: {
      fillColor: [39, 174, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold' as const,
      fontSize: 10,
      halign: 'center' as const
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [44, 62, 80]
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { top: 65, left: 15, right: 15 }
  };
};

const reportGenerator = {
  addReportHeader,
  addReportFooter,
  formatCurrency,
  formatDate,
  addSummarySection,
  getTableStyles,
  COMPANY_INFO,
  DAIRY_LOGO_BASE64
};

export default reportGenerator;
