import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaPlus, FaEdit, FaTrash, FaTruck, FaUser, FaMapMarkerAlt, FaCalendar, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import DeliveryForm from './DeliveryForm';
import { Delivery, APIResponse } from '../../types';
import './DeliveryList.css';

const DeliveryList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<APIResponse<Delivery[]>>('/deliveries');
      setDeliveries(response.data.data || response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch deliveries. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await api.delete(`/deliveries/${id}`);
        fetchDeliveries();
        alert('Delivery deleted successfully!');
      } catch (err: any) {
        alert('Failed to delete delivery. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  const openModal = (deliveryId: string | null = null): void => {
    setSelectedDeliveryId(deliveryId);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedDeliveryId(null);
    fetchDeliveries();
  };

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading deliveries...</div>;

  return (
    <>
      <div className="list-container">
        <div className="list-header">
          <div className="list-header-content">
            <h2><FaTruck /> Delivery Management</h2>
            <p>Track and manage product deliveries</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> Create New Delivery
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {deliveries.length === 0 ? (
          <div className="empty-state">
            <FaTruck className="empty-icon" />
            <h3>No Deliveries Found</h3>
            <p>Get started by creating your first delivery</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Create New Delivery
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {deliveries.map((delivery: Delivery) => (
              <div key={delivery._id} className="data-card delivery-card">
                <div className="card-status">
                  <span className={`badge badge-${delivery.status.toLowerCase().replace(' ', '-')}`}>
                    {delivery.status}
                  </span>
                </div>
                
                <div className="card-avatar">
                  <FaTruck />
                </div>

                <div className="card-main">
                  <h3 className="card-title">Delivery #{delivery.deliveryId}</h3>
                  <p className="card-subtitle">{delivery.customerName || 'N/A'}</p>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <FaCalendar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Delivery Date</span>
                      <span className="detail-value">{formatDate(delivery.deliveryDate)}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaUser className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Driver</span>
                      <span className="detail-value">
                        {typeof delivery.driver === 'object' && delivery.driver 
                          ? `${delivery.driver.firstName} ${delivery.driver.lastName}` 
                          : 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Destination</span>
                      <span className="detail-value">{delivery.deliveryAddress || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaBoxOpen className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Products</span>
                      <span className="detail-value">
                        {delivery.items?.length || 0} item(s)
                      </span>
                    </div>
                  </div>

                  {delivery.status === 'Delivered' && delivery.completedDate && (
                    <div className="detail-row">
                      <FaCheckCircle className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Completed</span>
                        <span className="detail-value">{formatDate(delivery.completedDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openModal(delivery._id)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(delivery._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedDeliveryId ? 'Edit Delivery' : 'Create New Delivery'}
        size="large"
      >
        <DeliveryForm deliveryId={selectedDeliveryId} onSuccess={closeModal} />
      </Modal>
    </>
  );
};

export default DeliveryList;
