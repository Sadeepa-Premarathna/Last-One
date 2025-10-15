// Order and Delivery Report Generator
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addReportHeader,
  addReportFooter,
  formatDate,
  formatCurrency,
  addSummarySection
} from './reportGenerator';
import { Order, Delivery } from '../types';

export const generateOrderReport = (
  orders: Order[],
  filterStatus?: string,
  logoDataUrl?: string
) => {
  const doc = new jsPDF();

  // Filter orders if needed
  const filteredOrders = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  // Add header
  const reportTitle = filterStatus
    ? `Order Report - ${filterStatus} Orders`
    : 'Order Report - All Orders';
  
  const currentY = addReportHeader(doc, reportTitle, logoDataUrl);

  // Calculate totals
  const totalAmount = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Add summary
  const summaryData = [
    { label: 'Total Orders', value: filteredOrders.length },
    { label: 'Total Amount', value: formatCurrency(totalAmount) },
    { label: 'Pending', value: filteredOrders.filter(o => o.status === 'Pending').length },
    { label: 'In Transit', value: filteredOrders.filter(o => o.status === 'In Transit').length },
    { label: 'Delivered', value: filteredOrders.filter(o => o.status === 'Delivered').length }
  ];

  const summaryEndY = addSummarySection(doc, currentY + 5, summaryData);

  // Prepare table data
  const tableData = filteredOrders.map((order, index) => {
    const addressStr = order.deliveryAddress && typeof order.deliveryAddress === 'object'
      ? `${order.deliveryAddress.street || ''}, ${order.deliveryAddress.city || ''}`
      : order.deliveryAddress || 'N/A';
    
    return [
      index + 1,
      order.orderId || 'N/A',
      formatDate(order.orderDate),
      addressStr,
      formatCurrency(order.totalAmount || 0),
      order.status || 'N/A'
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['#', 'Order ID', 'Date', 'Address', 'Amount', 'Status']],
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
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 55 },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 30, halign: 'center' }
    },
    didDrawPage: function(data) {
      const pageCount = (doc as any).internal.getNumberOfPages();
      addReportFooter(doc, data.pageNumber, pageCount, data.pageNumber === pageCount);
    }
  });

  // Save the PDF
  const fileName = `Order_Report_${filterStatus || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateDeliveryReport = (
  deliveries: Delivery[],
  filterStatus?: string,
  logoDataUrl?: string
) => {
  const doc = new jsPDF();

  // Filter deliveries if needed
  const filteredDeliveries = filterStatus
    ? deliveries.filter(d => d.status === filterStatus)
    : deliveries;

  // Add header
  const reportTitle = filterStatus
    ? `Delivery Report - ${filterStatus} Deliveries`
    : 'Delivery Report - All Deliveries';
  
  const currentY = addReportHeader(doc, reportTitle, logoDataUrl);

  // Add summary
  const summaryData = [
    { label: 'Total Deliveries', value: filteredDeliveries.length },
    { label: 'Pending', value: filteredDeliveries.filter(d => d.status === 'Pending').length },
    { label: 'In Transit', value: filteredDeliveries.filter(d => d.status === 'In Transit').length },
    { label: 'Delivered', value: filteredDeliveries.filter(d => d.status === 'Delivered').length }
  ];

  const summaryEndY = addSummarySection(doc, currentY + 5, summaryData);

  // Prepare table data
  const tableData = filteredDeliveries.map((delivery, index) => {
    let driverName = 'N/A';
    if (delivery.driver && typeof delivery.driver === 'object') {
      driverName = `${delivery.driver.firstName} ${delivery.driver.lastName}`;
    }

    return [
      index + 1,
      delivery.deliveryId || 'N/A',
      formatDate(delivery.deliveryDate),
      driverName,
      delivery.deliveryAddress || 'N/A',
      delivery.status || 'N/A'
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['#', 'Delivery ID', 'Date', 'Driver', 'Address', 'Status']],
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
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 50 },
      5: { cellWidth: 25, halign: 'center' }
    },
    didDrawPage: function(data) {
      const pageCount = (doc as any).internal.getNumberOfPages();
      addReportFooter(doc, data.pageNumber, pageCount, data.pageNumber === pageCount);
    }
  });

  // Save the PDF
  const fileName = `Delivery_Report_${filterStatus || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const orderDeliveryReportGenerator = {
  generateOrderReport,
  generateDeliveryReport
};

export default orderDeliveryReportGenerator;
