import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { RawMilk } from '../types/inventoryTypes';
import { rawMilkService } from '../services/inventoryApi';
import InventoryRawMilkForm from '../components/InventoryRawMilkForm';
import './InventoryRawMaterial.css';

const RawMaterial = () => {
  const [rawMilkData, setRawMilkData] = useState<RawMilk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RawMilk | null>(null);
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalQuantity: 0,
    totalAmount: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchRawMilkData();
    fetchStats();
  }, []);

  const fetchRawMilkData = async () => {
    try {
      const data = await rawMilkService.getAllRawMilk();
      setRawMilkData(data);
    } catch (error) {
      toast.error('Failed to fetch raw milk data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await rawMilkService.getRawMilkStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await rawMilkService.deleteRawMilk(id);
        toast.success('🗑️ Record deleted successfully!');
        fetchRawMilkData();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete record');
        console.error(error);
      }
    }
  };

  const handleEdit = (record: RawMilk) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingRecord(null);
    await fetchRawMilkData();
    await fetchStats();
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQualityBadgeClass = (quality: string) => {
    switch (quality) {
      case 'A': return 'quality-badge-a';
      case 'B': return 'quality-badge-b';
      case 'C': return 'quality-badge-c';
      default: return 'quality-badge-a';
    }
  };

  if (loading) {
    return (
      <div className="raw-material-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="raw-material-page">
      <div className="raw-material-header">
        <div>
          <h1>🥛 Raw Material Collections</h1>
          <p>Track and manage raw milk collections from suppliers</p>
        </div>
        <motion.button
          className="btn-add-collection"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Add Collection
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            📊
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Collections</p>
            <h2 className="stat-value">{stats.totalRecords}</h2>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            🥛
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Quantity</p>
            <h2 className="stat-value">{stats.totalQuantity.toFixed(2)} L</h2>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            �
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Suppliers</p>
            <h2 className="stat-value">{new Set(rawMilkData.map(r => r.supplierName)).size}</h2>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            ⭐
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Fat Content</p>
            <h2 className="stat-value">
              {rawMilkData.length > 0 
                ? (rawMilkData.reduce((sum, r) => sum + r.fatContent, 0) / rawMilkData.length).toFixed(1)
                : '0'}%
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Data Table */}
      <div className="raw-milk-table-container">
        <table className="raw-milk-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Fat %</th>
              <th>Quality</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rawMilkData.length === 0 ? (
              <tr>
                <td colSpan={10} className="no-data">
                  No raw milk collections found. Add your first collection!
                </td>
              </tr>
            ) : (
              rawMilkData.map((record, index) => (
                <motion.tr
                  key={record._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>{formatDate(record.collectionDate)}</td>
                  <td className="supplier-name">{record.supplierName}</td>
                  <td>{record.contactNumber}</td>
                  <td>{record.location}</td>
                  <td className="quantity-cell">{record.quantity}</td>
                  <td>{record.unit}</td>
                  <td className="fat-content">{record.fatContent}%</td>
                  <td>
                    <span className={`quality-badge ${getQualityBadgeClass(record.quality)}`}>
                      Grade {record.quality}
                    </span>
                  </td>
                  <td className="notes-cell">{record.notes || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <motion.button
                        className="btn-edit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(record)}
                        title="Edit"
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        className="btn-delete"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(record._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <InventoryRawMilkForm
          record={editingRecord}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default RawMaterial;
