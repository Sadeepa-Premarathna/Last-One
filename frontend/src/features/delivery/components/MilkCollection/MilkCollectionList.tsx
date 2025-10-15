import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaPlus, FaTint } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import MilkCollectionForm from './MilkCollectionForm';
import { MilkCollection, APIResponse } from '../../types';
import './MilkCollectionList.css';
import MilkCollectionCard from './MilkCollectionCard';

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
      const response = await api.get<APIResponse<MilkCollection[]>>('/delivery/milk-collection');
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
        await api.delete(`/delivery/milk-collection/${id}`);
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

  if (loading) {
    return <div className="loading">Loading milk collections...</div>;
  }

  const totalLiters = collections.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const totalValue = collections.reduce((sum, c) => sum + (c.totalValue || ((c.paymentAmount || 0) * (c.quantity || 0))), 0);
  const pending = collections.filter(c => (c.paymentStatus || 'Pending') === 'Pending').length;
  const paid = collections.filter(c => c.paymentStatus === 'Paid').length;

  return (
    <div className="page-container">
      <div className="list-container">
        <div className="list-header">
          <div className="list-header-content">
            <h2><FaTint /> Milk Collections</h2>
            <p>Manage daily milk intakes, quality metrics & payments</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> New Collection
          </button>
        </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-bar" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'0.75rem',marginBottom:'1rem'}}>
        <div className="stat-tile">
          <strong>{collections.length}</strong>
          <span>Total Records</span>
        </div>
        <div className="stat-tile">
          <strong>{totalLiters.toFixed(2)} L</strong>
          <span>Total Quantity</span>
        </div>
        <div className="stat-tile">
          <strong>Rs. {totalValue.toFixed(2)}</strong>
          <span>Total Value</span>
        </div>
        <div className="stat-tile">
          <strong>{paid}</strong>
          <span>Paid</span>
        </div>
        <div className="stat-tile">
          <strong>{pending}</strong>
          <span>Pending</span>
        </div>
      </div>

      <div className="cards-grid">
        {collections.map(collection => (
          <MilkCollectionCard
            key={collection._id}
            collection={collection}
            onEdit={(id) => openModal(id)}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </div>

      {collections.length === 0 && !loading && (
        <div className="empty-state">
          <FaTint className="empty-icon" />
          <h3>No Milk Collections Found</h3>
          <p>Get started by recording your first milk collection</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> Add New Collection
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedCollectionId ? 'Edit Collection' : 'Add New Collection'}>
        <MilkCollectionForm collectionId={selectedCollectionId} onSuccess={closeModal} />
      </Modal>
      </div>
    </div>
  );
};

export default MilkCollectionList;
