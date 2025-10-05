import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { Farmer, Driver, MilkCollection, QualityMetrics, APIResponse, FormErrors } from '../../types';

interface MilkCollectionFormProps {
  collectionId?: string | null;
  onSuccess?: () => void;
}

interface MilkCollectionFormData {
  collectionId: string;
  farmer: string;
  driver: string;
  collectionDate: string;
  collectionTime: string;
  quantity: number;
  unit: string;
  quality: {
    fatContent: number;
    snf: number;
    temperature: number;
    smell: string;
    grade: string;
  };
  pricePerLiter: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  notes: string;
}

const MilkCollectionForm: React.FC<MilkCollectionFormProps> = ({ collectionId: propCollectionId, onSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const collectionId = propCollectionId || id || null;
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState<MilkCollectionFormData>({
    collectionId: '',
    farmer: '',
    driver: '',
    collectionDate: '',
    collectionTime: 'Morning',
    quantity: 0,
    unit: 'Liters',
    quality: {
      fatContent: 0,
      snf: 0,
      temperature: 0,
      smell: 'Normal',
      grade: 'A'
    },
    pricePerLiter: 0,
    totalAmount: 0,
    paymentStatus: 'Pending',
    status: 'Collected',
    notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchFarmers();
    fetchDrivers();
    if (collectionId) {
      fetchCollection(collectionId);
    }
  }, [collectionId]);

  useEffect(() => {
    // Calculate total amount when quantity or price changes
    const total = formData.quantity * formData.pricePerLiter;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.quantity, formData.pricePerLiter]);

  const fetchFarmers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Farmer[]>>('/farmers');
      setFarmers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching farmers:', err);
    }
  };

  const fetchDrivers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Driver[]>>('/drivers');
      setDrivers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  };

  const fetchCollection = async (id: string): Promise<void> => {
    try {
      const response = await api.get<APIResponse<MilkCollection>>(`/milk-collections/${id}`);
      const collection = response.data.data;
      
      setFormData({
        collectionId: collection.collectionId || '',
        farmer: typeof collection.farmer === 'object' ? collection.farmer._id || '' : collection.farmer || '',
        driver: typeof collection.driver === 'object' ? collection.driver._id || '' : collection.driver || '',
        collectionDate: collection.collectionDate 
          ? new Date(collection.collectionDate).toISOString().split('T')[0]
          : '',
        collectionTime: collection.collectionTime || 'Morning',
        quantity: collection.quantity || 0,
        unit: collection.unit || 'Liters',
        quality: {
          fatContent: collection.quality?.fatContent || 0,
          snf: collection.quality?.snf || 0,
          temperature: collection.quality?.temperature || 0,
          smell: collection.quality?.smell || 'Normal',
          grade: collection.quality?.grade || 'A'
        },
        pricePerLiter: collection.pricePerLiter || 0,
        totalAmount: collection.totalAmount || 0,
        paymentStatus: collection.paymentStatus || 'Pending',
        status: collection.status || 'Collected',
        notes: collection.notes || ''
      });
    } catch (err) {
      console.error('Error fetching collection:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Handle nested quality object
    if (name.startsWith('quality.')) {
      const qualityField = name.split('.')[1] as keyof QualityMetrics;
      setFormData(prev => ({
        ...prev,
        quality: {
          ...prev.quality,
          [qualityField]: ['fatContent', 'snf', 'temperature'].includes(qualityField) 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['quantity', 'pricePerLiter'].includes(name) ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.collectionId.trim()) {
      newErrors.collectionId = 'Collection ID is required';
    }
    if (!formData.farmer) {
      newErrors.farmer = 'Farmer is required';
    }
    if (!formData.driver) {
      newErrors.driver = 'Driver is required';
    }
    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Collection date is required';
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.quality.grade) {
      newErrors['quality.grade'] = 'Quality grade is required';
    }
    if (formData.pricePerLiter <= 0) {
      newErrors.pricePerLiter = 'Price per liter must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (collectionId) {
        await api.put(`/milk-collections/${collectionId}`, formData);
      } else {
        await api.post('/milk-collections', formData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/milk-collections');
      }
    } catch (err: any) {
      console.error('Error saving milk collection:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to save milk collection' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="milk-collection-form">
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-section">
        <h3>Collection Information</h3>

        <div className="form-group">
          <label htmlFor="collectionId">
            Collection ID <span className="required">*</span>
          </label>
          <input
            type="text"
            id="collectionId"
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
            disabled={!!collectionId}
            placeholder="Enter collection ID"
          />
          {errors.collectionId && <span className="error">{errors.collectionId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="farmer">
              Farmer <span className="required">*</span>
            </label>
            <select
              id="farmer"
              name="farmer"
              value={formData.farmer}
              onChange={handleChange}
            >
              <option value="">Select Farmer</option>
              {farmers.map((farmer) => (
                <option key={farmer._id} value={farmer._id}>
                  {farmer.firstName} {farmer.lastName} - {farmer.farmerId}
                </option>
              ))}
            </select>
            {errors.farmer && <span className="error">{errors.farmer}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driver">
              Driver <span className="required">*</span>
            </label>
            <select
              id="driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName} - {driver.vehicleNumber}
                </option>
              ))}
            </select>
            {errors.driver && <span className="error">{errors.driver}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="collectionDate">
              Collection Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="collectionDate"
              name="collectionDate"
              value={formData.collectionDate}
              onChange={handleChange}
            />
            {errors.collectionDate && <span className="error">{errors.collectionDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="collectionTime">Collection Time</label>
            <select
              id="collectionTime"
              name="collectionTime"
              value={formData.collectionTime}
              onChange={handleChange}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">
              Quantity <span className="required">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter quantity"
            />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="Liters">Liters</option>
              <option value="Gallons">Gallons</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Quality Assessment</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quality.fatContent">Fat Content (%)</label>
            <input
              type="number"
              id="quality.fatContent"
              name="quality.fatContent"
              value={formData.quality.fatContent}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              placeholder="Enter fat content"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quality.snf">SNF - Solid Not Fat (%)</label>
            <input
              type="number"
              id="quality.snf"
              name="quality.snf"
              value={formData.quality.snf}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              placeholder="Enter SNF"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quality.temperature">Temperature (°C)</label>
            <input
              type="number"
              id="quality.temperature"
              name="quality.temperature"
              value={formData.quality.temperature}
              onChange={handleChange}
              step="0.1"
              placeholder="Enter temperature"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quality.smell">Smell</label>
            <select
              id="quality.smell"
              name="quality.smell"
              value={formData.quality.smell}
              onChange={handleChange}
            >
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quality.grade">
            Quality Grade <span className="required">*</span>
          </label>
          <select
            id="quality.grade"
            name="quality.grade"
            value={formData.quality.grade}
            onChange={handleChange}
          >
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="Rejected">Rejected</option>
          </select>
          {errors['quality.grade'] && <span className="error">{errors['quality.grade']}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Payment Information</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pricePerLiter">
              Price per Liter (Rs.) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="pricePerLiter"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter price per liter"
            />
            {errors.pricePerLiter && <span className="error">{errors.pricePerLiter}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="totalAmount">Total Amount (Rs.)</label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount.toFixed(2)}
              readOnly
              disabled
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Collected">Collected</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Enter any additional notes"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : collectionId ? 'Update Collection' : 'Create Collection'}
        </button>
      </div>
    </form>
  );
};

export default MilkCollectionForm;
