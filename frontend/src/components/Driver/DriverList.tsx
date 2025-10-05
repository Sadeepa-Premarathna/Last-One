import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaPlus, FaEdit, FaTrash, FaCar, FaUser, FaPhone, FaIdCard, FaMapMarkerAlt, FaFilePdf } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import DriverForm from './DriverForm';
import ReportButton from '../Reports/ReportButton';
import { Driver, APIResponse } from '../../types';
import { loadLogoAsBase64, getDairyLiciousLogoSVG } from '../../utils/logoHelper';
import './DriverList.css';

// Generate PDF Report with logo
const generateDriverPDFReport = async (drivers: Driver[], reportType: 'all' | 'active' | 'inactive' = 'all') => {
  const { generateDriverReport } = await import('../../utils/driverReportGenerator');
  
  try {
    // Try to load actual logo image first
    const logoUrl = await loadLogoAsBase64();
    generateDriverReport(drivers, reportType, logoUrl);
  } catch (error) {
    // Fallback to SVG if image fails to load
    console.warn('Using SVG fallback logo:', error);
    const logoUrl = getDairyLiciousLogoSVG();
    generateDriverReport(drivers, reportType, logoUrl);
  }
};

const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<APIResponse<Driver[]>>('/drivers');
      setDrivers(response.data.data || response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch drivers. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/drivers/${id}`);
        fetchDrivers();
        alert('Driver deleted successfully!');
      } catch (err: any) {
        alert('Failed to delete driver. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  const openModal = (driverId: string | null = null): void => {
    setSelectedDriverId(driverId);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedDriverId(null);
    fetchDrivers(); // Refresh list after closing modal
  };

  if (loading) return <div className="loading">Loading drivers...</div>;

  return (
    <>
      <div className="list-container">
        <div className="list-header">
          <div className="list-header-content">
            <h2><FaUser /> Driver Management</h2>
            <p>Manage your delivery drivers and vehicles</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> Add New Driver
          </button>
        </div>

        {/* Report Generation Section */}
        <div className="report-actions">
          <div className="report-actions-header">
            <h3>
              <FaFilePdf className="report-icon" />
              Generate Reports
            </h3>
          </div>
          <div className="report-actions-buttons">
            <ReportButton
              label="All Drivers Report"
              onClick={() => generateDriverPDFReport(drivers, 'all')}
              variant="primary"
            />
            <ReportButton
              label="Active Drivers"
              onClick={() => generateDriverPDFReport(drivers, 'active')}
              variant="success"
            />
            <ReportButton
              label="Inactive Drivers"
              onClick={() => generateDriverPDFReport(drivers, 'inactive')}
              variant="secondary"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {drivers.length === 0 ? (
          <div className="empty-state">
            <FaUser className="empty-icon" />
            <h3>No Drivers Found</h3>
            <p>Get started by adding your first driver</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add New Driver
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {drivers.map((driver: Driver) => (
              <div key={driver._id} className="data-card driver-card">
                <div className="card-status">
                  <span className={`badge badge-${driver.status.toLowerCase()}`}>
                    {driver.status}
                  </span>
                </div>
                
                <div className="card-avatar">
                  <FaUser />
                </div>

                <div className="card-main">
                  <h3 className="card-title">{driver.firstName} {driver.lastName}</h3>
                  <p className="card-subtitle">{driver.driverId}</p>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <FaIdCard className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">NIC</span>
                      <span className="detail-value">{driver.nic}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaIdCard className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">License</span>
                      <span className="detail-value">{driver.licenseNumber}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Contact</span>
                      <span className="detail-value">{driver.contactNumber}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaCar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Vehicle</span>
                      <span className="detail-value">{driver.vehicleNumber} ({driver.vehicleType})</span>
                    </div>
                  </div>

                  {driver.assignedRoute && (
                    <div className="detail-row">
                      <FaMapMarkerAlt className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Route</span>
                        <span className="detail-value">{driver.assignedRoute}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openModal(driver._id)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(driver._id)}
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
        title={selectedDriverId ? 'Edit Driver' : 'Add New Driver'}
        size="large"
      >
        <DriverForm driverId={selectedDriverId} onSuccess={closeModal} />
      </Modal>
    </>
  );
};

export default DriverList;
