import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaPlus, FaEdit, FaTrash, FaUser, FaCalendar, FaTint, FaStar, FaDollarSign } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import MilkCollectionForm from './MilkCollectionForm';
import { MilkCollection, APIResponse } from '../../types';
import './MilkCollectionList.css';

const MilkCollectionList: React.FC = () => {
  const [collections, setCollections] = useState<MilkCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<APIResponse<MilkCollection[]>>('/milk-collections');
      setCollections(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch milk collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this milk collection?')) {
      try {
        await api.delete(`/milk-collections/${id}`);
        fetchCollections();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete milk collection');
      }
    }
  };

  const openModal = (collectionId: string | null = null): void => {
    setSelectedCollectionId(collectionId);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedCollectionId(null);
    fetchCollections();
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getQualityBadgeClass = (grade?: string): string => {
    switch (grade?.toUpperCase()) {
      case 'A':
        return 'quality-badge quality-a';
      case 'B':
        return 'quality-badge quality-b';
      case 'C':
        return 'quality-badge quality-c';
      case 'REJECTED':
        return 'quality-badge quality-rejected';
      default:
        return 'quality-badge';
    }
  };

  if (loading) {
    return <div className="loading">Loading milk collections...</div>;
  }

  return (
    <div className="milk-collection-list">
      <div className="list-header">
        <h2>Milk Collections</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add New Collection
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="collections-grid">
        {collections.map((collection) => (
          <div key={collection._id} className="collection-card">
            <div className="card-header">
              <h3>Collection ID: {collection.collectionId || 'N/A'}</h3>
              <div className="card-actions">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => openModal(collection._id)}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => collection._id && handleDelete(collection._id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="info-row">
                <FaUser className="icon" />
                <span className="label">Farmer:</span>
                <span className="value">
                  {collection.farmer && typeof collection.farmer === 'object'
                    ? `${collection.farmer.firstName} ${collection.farmer.lastName}`
                    : collection.farmer || 'N/A'}
                </span>
              </div>

              <div className="info-row">
                <FaCalendar className="icon" />
                <span className="label">Date:</span>
                <span className="value">{formatDate(collection.collectionDate)}</span>
              </div>

              <div className="info-row">
                <FaTint className="icon" />
                <span className="label">Quantity:</span>
                <span className="value">
                  {collection.quantity || 0} {collection.unit || 'Liters'}
                </span>
              </div>

              {collection.quality && (
                <div className="quality-section">
                  <div className="quality-metrics">
                    <div className="metric">
                      <span className="metric-label">Fat:</span>
                      <span className="metric-value">{collection.quality.fatContent || 0}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">SNF:</span>
                      <span className="metric-value">{collection.quality.snf || 0}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Temp:</span>
                      <span className="metric-value">{collection.quality.temperature || 0}°C</span>
                    </div>
                  </div>
                  <div className="quality-grade">
                    <FaStar className="icon" />
                    <span className={getQualityBadgeClass(collection.quality.grade)}>
                      Grade {collection.quality.grade || 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              <div className="info-row">
                <FaDollarSign className="icon" />
                <span className="label">Amount:</span>
                <span className="value amount">Rs. {collection.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="payment-status">
                <span className={`status-badge status-${collection.paymentStatus?.toLowerCase()}`}>
                  {collection.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && !loading && (
        <div className="no-data">
          <p>No milk collections found. Click "Add New Collection" to create one.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedCollectionId ? 'Edit Collection' : 'Add New Collection'}>
        <MilkCollectionForm collectionId={selectedCollectionId} onSuccess={closeModal} />
      </Modal>
    </div>
  );
};

export default MilkCollectionList;
