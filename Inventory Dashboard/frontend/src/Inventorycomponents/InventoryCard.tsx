import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Product } from '../Inventorytypes/inventoryTypes';
import { formatDate, formatCurrency, getExpiryStatus, getStatusColor } from '../Inventoryutils/inventoryHelpers';
import './InventoryCard.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  // Calculate expiry date from manufacture date + expiry days
  const expiryDate = new Date(product.manufactureDate);
  expiryDate.setDate(expiryDate.getDate() + product.expiryDays);
  const expiryDateString = expiryDate.toISOString();
  
  const expiryStatus = getExpiryStatus(expiryDateString);
  const statusColor = getStatusColor(product.status);

  // Log image URL for debugging
  if (product.image && !product.image.startsWith('http') && !product.image.startsWith('data:')) {
    console.warn('Invalid image for product:', product.name, 'URL:', product.image);
  }

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=Dairy+Product'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            console.error('Image load error for product:', product.name);
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=Dairy+Product';
          }}
        />
        <div className="product-status" style={{ backgroundColor: statusColor }}>
          {product.status.replace('-', ' ').toUpperCase()}
        </div>
        {expiryStatus.color === 'red' && (
          <div className="expiry-warning">
            <FaExclamationTriangle />
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-category">{product.category}</span>

        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <div className="detail-item">
            <span className="detail-label">Price:</span>
            <span className="detail-value">{formatCurrency(product.price)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Stock:</span>
            <span className="detail-value">
              {product.stock} {product.unit}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Batch:</span>
            <span className="detail-value">{product.batchNumber}</span>
          </div>
        </div>

        <div className="product-dates">
          <div className="date-item">
            <span className="date-label">Manufactured:</span>
            <span className="date-value">{formatDate(product.manufactureDate)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Expires:</span>
            <span className="date-value" style={{ color: expiryStatus.color }}>
              {formatDate(expiryDateString)}
            </span>
          </div>
          <div className="expiry-countdown" style={{ color: expiryStatus.color }}>
            {expiryStatus.text}
          </div>
        </div>
      </div>

      <div className="product-actions">
        <motion.button
          className="btn-edit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(product)}
        >
          <FaEdit /> Edit
        </motion.button>
        <motion.button
          className="btn-delete"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(product._id)}
        >
          <FaTrash /> Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
