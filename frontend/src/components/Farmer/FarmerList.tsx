import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaPhone, FaIdCard, FaMapMarkerAlt, FaLeaf } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import FarmerForm from './FarmerForm';
import { Farmer, APIResponse } from '../../types';
import './FarmerList.css';

const FarmerList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<APIResponse<Farmer[]>>('/farmers');
      setFarmers(response.data.data || response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch farmers. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await api.delete(`/farmers/${id}`);
        fetchFarmers();
        alert('Farmer deleted successfully!');
      } catch (err: any) {
        alert('Failed to delete farmer. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  const openModal = (farmerId: string | null = null): void => {
    setSelectedFarmerId(farmerId);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedFarmerId(null);
    fetchFarmers();
  };

  if (loading) return <div className="loading">Loading farmers...</div>;

  return (
    <>
      <div className="list-container">
        <div className="list-header">
          <div className="list-header-content">
            <h2><FaUsers /> Farmer Management</h2>
            <p>Manage farmers and milk suppliers</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> Add New Farmer
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {farmers.length === 0 ? (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No Farmers Found</h3>
            <p>Get started by adding your first farmer</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add New Farmer
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {farmers.map((farmer: Farmer) => (
              <div key={farmer._id} className="data-card farmer-card">
                <div className="card-status">
                  <span className={`badge badge-${farmer.status.toLowerCase()}`}>
                    {farmer.status}
                  </span>
                </div>
                
                <div className="card-avatar">
                  <FaUsers />
                </div>

                <div className="card-main">
                  <h3 className="card-title">{farmer.firstName} {farmer.lastName}</h3>
                  <p className="card-subtitle">{farmer.farmerId}</p>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <FaIdCard className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">NIC</span>
                      <span className="detail-value">{farmer.nic}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Contact</span>
                      <span className="detail-value">{farmer.contactNumber}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaLeaf className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Farm Size</span>
                      <span className="detail-value">{farmer.farmSize || 'N/A'} acres</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaLeaf className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Number of Cows</span>
                      <span className="detail-value">{farmer.numberOfCows}</span>
                    </div>
                  </div>

                  {farmer.location && (
                    <div className="detail-row">
                      <FaMapMarkerAlt className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{farmer.location}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openModal(farmer._id)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(farmer._id)}
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
        title={selectedFarmerId ? 'Edit Farmer' : 'Add New Farmer'}
        size="large"
      >
        <FarmerForm farmerId={selectedFarmerId} onSuccess={closeModal} />
      </Modal>
    </>
  );
};

export default FarmerList;
