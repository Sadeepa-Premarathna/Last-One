import { useRef } from 'react';
import { Product } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { FaPrint, FaDownload } from 'react-icons/fa';
import './ProductReport.css';

interface ProductReportProps {
  products: Product[];
  reportType?: 'all' | 'expiring' | 'lowstock';
  onClose: () => void;
}

const ProductReport = ({ products, reportType = 'all', onClose }: ProductReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const getReportTitle = () => {
    switch (reportType) {
      case 'expiring':
        return 'Expiring Products Report';
      case 'lowstock':
        return 'Low Stock Products Report';
      default:
        return 'Products Inventory Report';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printContent = reportRef.current;
    if (!printContent) return;

    const WinPrint = window.open('', '', 'width=900,height=650');
    if (!WinPrint) return;

    WinPrint.document.write(`
      <html>
        <head>
          <title>${getReportTitle()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Poppins', Arial, sans-serif; padding: 40px; }
            .report-container { max-width: 1000px; margin: 0 auto; }
            .report-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
            .logo-container { margin-bottom: 15px; }
            .logo-image { max-width: 150px; height: auto; }
            .company-name { font-size: 28px; font-weight: 700; color: #1f2937; margin-bottom: 5px; }
            .report-title { font-size: 20px; color: #3b82f6; font-weight: 600; }
            .report-meta { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f5f7fa; border-radius: 8px; }
            .meta-item { font-size: 14px; color: #4b5563; }
            .meta-label { font-weight: 600; color: #1f2937; }
            .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .products-table th { background: #3b82f6; color: white; padding: 12px; text-align: left; font-size: 13px; font-weight: 600; }
            .products-table td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #4b5563; }
            .products-table tr:hover { background: #f9fafb; }
            .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block; }
            .status-active { background: #d1fae5; color: #065f46; }
            .status-low { background: #fef3c7; color: #92400e; }
            .status-expired { background: #fee2e2; color: #991b1b; }
            .status-out { background: #f3f4f6; color: #1f2937; }
            .report-footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { width: 45%; }
            .signature-label { font-size: 14px; color: #4b5563; margin-bottom: 40px; font-weight: 600; }
            .signature-line { border-top: 2px solid #1f2937; padding-top: 8px; text-align: center; font-size: 12px; color: #6b7280; }
            .report-summary { display: flex; gap: 20px; margin: 20px 0; }
            .summary-card { flex: 1; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .summary-label { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
            .summary-value { font-size: 24px; font-weight: 700; color: #1f2937; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const calculateTotalValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'low stock':
        return 'status-low';
      case 'expired':
        return 'status-expired';
      case 'out of stock':
        return 'status-out';
      default:
        return '';
    }
  };

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className="report-actions no-print">
          <button className="btn-action" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button className="btn-action" onClick={handleDownload}>
            <FaDownload /> Download
          </button>
          <button className="btn-close" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div className="report-container" ref={reportRef}>
          <div className="report-header">
            <div className="logo-container">
              <img 
                src="/dairy-licious-logo.png" 
                alt="Dairy Licious Logo" 
                className="logo-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="company-name">DAIRY LICIOUS</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
              Premium Dairy Products Manufacturer - Sri Lanka
            </p>
            <h2 className="report-title">{getReportTitle()}</h2>
          </div>

          <div className="report-meta">
            <div className="meta-item">
              <span className="meta-label">Generated Date:</span> {formatDate(new Date().toISOString())}
            </div>
            <div className="meta-item">
              <span className="meta-label">Total Products:</span> {products.length}
            </div>
            <div className="meta-item">
              <span className="meta-label">Report Type:</span> {reportType.toUpperCase()}
            </div>
          </div>

          <div className="report-summary">
            <div className="summary-card">
              <div className="summary-label">Total Products</div>
              <div className="summary-value">{products.length}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Total Stock</div>
              <div className="summary-value">
                {products.reduce((sum, p) => sum + p.stock, 0)} units
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Total Value</div>
              <div className="summary-value">{formatCurrency(calculateTotalValue())}</div>
            </div>
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Batch No.</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Mfg Date</th>
                <th>Expiry Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const expiryDate = new Date(product.manufactureDate);
                expiryDate.setDate(expiryDate.getDate() + product.expiryDays);
                return (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.batchNumber}</td>
                  <td>{product.category}</td>
                  <td>{product.stock} {product.unit}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{formatCurrency(product.price * product.stock)}</td>
                  <td>{formatDate(product.manufactureDate)}</td>
                  <td>{product.expiryDays} days</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>

          <div className="report-footer">
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
              <strong>Note:</strong> This report contains accurate inventory information as of the generation date. 
              All products are stored under optimal conditions maintaining quality standards.
            </div>

            <div className="signature-section">
              <div className="signature-box">
                <div className="signature-label">Prepared By:</div>
                <div className="signature-line">Inventory Manager</div>
              </div>
              <div className="signature-box">
                <div className="signature-label">Approved By:</div>
                <div className="signature-line">Operations Director</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '11px', color: '#9ca3af' }}>
              <p>Dairy Licious - Premium Dairy Products Manufacturing</p>
              <p>Sri Lanka | Contact: info@dairylicious.lk</p>
              <p style={{ marginTop: '10px' }}>This is a computer-generated report and does not require a physical signature for internal use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
