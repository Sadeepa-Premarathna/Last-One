import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '../../config/api';
import { FaTruck, FaSave } from 'react-icons/fa';
import { Driver, Order, APIResponse } from '../../types';

interface AssignDriverModalProps {
  orderId: string | null;
  onSuccess: () => void;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ orderId, onSuccess }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDrivers();
    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchDrivers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Driver[]>>('/drivers');
      // Only show active drivers
      const activeDrivers = (response.data.data || []).filter(
        (driver: Driver) => driver.status === 'Active'
      );
      setDrivers(activeDrivers);
    } catch (err: any) {
      setError('Failed to fetch drivers');
      console.error('Error:', err);
    }
  };

  const fetchOrderDetails = async (): Promise<void> => {
    if (!orderId) return;
    
    try {
      const response = await api.get<APIResponse<Order>>(`/orders/${orderId}`);
      const order = response.data.data;
      
      if (order.assignedDriver) {
        if (typeof order.assignedDriver === 'object') {
          setSelectedDriver(order.assignedDriver._id || '');
        } else {
          setSelectedDriver(order.assignedDriver);
        }
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!selectedDriver) {
      setError('Please select a driver');
      return;
    }

    if (!orderId) {
      setError('Order ID is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.patch(`/orders/${orderId}/assign-driver`, { 
        driverId: selectedDriver 
      });
      alert('Driver assigned successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign driver. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-modal">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="driver">
            <FaTruck /> Select Driver *
          </label>
          <select
            id="driver"
            name="driver"
            value={selectedDriver}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDriver(e.target.value)}
            required
          >
            <option value="">-- Select a Driver --</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.firstName} {driver.lastName} - {driver.vehicleNumber} ({driver.vehicleType})
              </option>
            ))}
          </select>
        </div>

        {drivers.length === 0 && (
          <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            No active drivers available. Please add drivers first.
          </p>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || drivers.length === 0}
          >
            <FaSave /> {loading ? 'Assigning...' : 'Assign Driver'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignDriverModal;
