import React from 'react';
import { MilkCollection } from '../../types';
import { FaUser, FaTruck, FaCalendar, FaFlask, FaWeightHanging, FaDollarSign, FaClock, FaTint, FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
  collection: MilkCollection;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MilkCollectionCard: React.FC<Props> = ({ collection, onEdit, onDelete }) => {
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString(undefined, { dateStyle: 'medium' });
  };

  const getPaymentStatusClass = (status?: string) => {
    if (!status) return 'pending';
    return status.toLowerCase();
  };

  return (
    <div className="data-card milk-collection-card">
      <div className="card-status">
        <span className={`badge badge-${getPaymentStatusClass(collection.paymentStatus)}`}>
          {collection.paymentStatus || 'Pending'}
        </span>
      </div>
      
      <div className="card-avatar">
        <FaTint />
      </div>

      <div className="card-main">
        <h3 className="card-title">{collection.collectionId}</h3>
        <p className="card-subtitle">Grade {collection.qualityGrade || 'N/A'}</p>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <FaUser className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Farmer</span>
            <span className="detail-value">{collection.farmerName || collection.farmerId || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <FaTruck className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Driver</span>
            <span className="detail-value">{collection.driverName || collection.driverId || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <FaCalendar className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(collection.collectionDate)}</span>
          </div>
        </div>

        <div className="detail-row">
          <FaWeightHanging className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Quantity</span>
            <span className="detail-value">{collection.quantity} {collection.unit || 'L'}</span>
          </div>
        </div>

        {collection.collectionShift && (
          <div className="detail-row">
            <FaClock className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Shift</span>
              <span className="detail-value">{collection.collectionShift}</span>
            </div>
          </div>
        )}

        {(collection.fat_content !== undefined || collection.protein_content !== undefined) && (
          <div className="detail-row">
            <FaFlask className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Quality</span>
              <span className="detail-value">
                {collection.fat_content !== undefined && `Fat: ${collection.fat_content}%`}
                {collection.fat_content !== undefined && collection.protein_content !== undefined && ' | '}
                {collection.protein_content !== undefined && `Protein: ${collection.protein_content}%`}
              </span>
            </div>
          </div>
        )}

        <div className="detail-row">
          <FaDollarSign className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Amount</span>
            <span className="detail-value">Rs. {(collection.totalValue || (collection.paymentAmount || 0) * (collection.quantity || 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn btn-warning btn-sm"
          onClick={() => onEdit(collection._id)}
        >
          <FaEdit /> Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(collection._id)}
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default MilkCollectionCard;
