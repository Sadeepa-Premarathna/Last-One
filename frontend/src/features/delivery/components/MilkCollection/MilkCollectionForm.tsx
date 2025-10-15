import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { Farmer, Driver, MilkCollection, APIResponse, FormErrors } from '../../types';

interface MilkCollectionFormProps {
  collectionId?: string | null;
  onSuccess?: () => void;
}

interface MilkCollectionFormData {
  collectionId: string;
  farmer: string;
  driver: string;
  collectionDate: string;
  quantity: number;
  qualityGrade: 'A' | 'B' | 'C' | 'Rejected';
  collectionShift: 'Morning' | 'Evening';
  unit: 'Liters' | 'Gallons';
  fat_content: number;
  snf: number;
  protein_content: number;
  temperature: number;
  ph_level: number;
  smell: 'Normal' | 'Abnormal';
  paymentAmount: number; // price per liter
  totalValue: number;    // computed
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Collected' | 'Processing' | 'Completed';
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
    quantity: 0,
    qualityGrade: 'A',
    collectionShift: 'Morning',
    unit: 'Liters',
    fat_content: 0,
    snf: 0,
    protein_content: 0,
    temperature: 0,
    ph_level: 7,
    smell: 'Normal',
    paymentAmount: 0,
    totalValue: 0,
    paymentStatus: 'Pending',
    status: 'Pending',
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
    const total = formData.quantity * formData.paymentAmount;
    setFormData(prev => ({ ...prev, totalValue: total }));
  }, [formData.quantity, formData.paymentAmount]);

  const fetchFarmers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Farmer[]>>('/delivery/farmers');
      setFarmers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching farmers:', err);
    }
  };

  const fetchDrivers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Driver[]>>('/delivery/drivers');
      setDrivers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  };

  const fetchCollection = async (id: string): Promise<void> => {
    try {
      const response = await api.get<APIResponse<MilkCollection>>(`/delivery/milk-collection/${id}`);
      const collection = response.data.data;
      
      setFormData({
        collectionId: collection.collectionId || '',
        farmer: typeof collection.farmer === 'object' ? collection.farmer._id || '' : (collection.farmer as string) || '',
        driver: typeof collection.driver === 'object' ? collection.driver._id || '' : (collection.driver as string) || '',
        collectionDate: collection.collectionDate ? new Date(collection.collectionDate).toISOString().split('T')[0] : '',
        quantity: collection.quantity || 0,
        qualityGrade: (collection.qualityGrade as 'A' | 'B' | 'C' | 'Rejected') || 'A',
        collectionShift: (collection as any).collectionShift || 'Morning',
        unit: (collection as any).unit || 'Liters',
        fat_content: collection.fat_content || 0,
        snf: (collection as any).snf || 0,
        protein_content: collection.protein_content || 0,
        temperature: collection.temperature || 0,
        ph_level: collection.ph_level || 7,
        smell: (collection as any).smell || 'Normal',
        paymentAmount: collection.paymentAmount || 0,
        totalValue: collection.totalValue || 0,
        paymentStatus: collection.paymentStatus || 'Pending',
        status: collection.status || 'Pending',
        notes: collection.notes || ''
      });
    } catch (err) {
      console.error('Error fetching collection:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    const numeric = ['quantity','fat_content','snf','protein_content','temperature','ph_level','paymentAmount'];
    setFormData(prev => ({ ...prev, [name]: numeric.includes(name) ? (parseFloat(value) || 0) : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Collection ID validation
    if (!formData.collectionId.trim()) {
      newErrors.collectionId = 'Collection ID is required';
    } else if (formData.collectionId.trim().length < 3) {
      newErrors.collectionId = 'Collection ID must be at least 3 characters';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.collectionId)) {
      newErrors.collectionId = 'Collection ID can only contain letters, numbers, and hyphens';
    }

    // Farmer validation
    if (!formData.farmer) {
      newErrors.farmer = 'Farmer is required';
    }

    // Driver validation
    if (!formData.driver) {
      newErrors.driver = 'Driver is required';
    }

    // Collection date validation
    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Collection date is required';
    } else {
      const collectionDate = new Date(formData.collectionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureLimit = new Date();
      futureLimit.setDate(futureLimit.getDate() + 7);
      
      if (collectionDate > futureLimit) {
        newErrors.collectionDate = 'Collection date cannot be more than 7 days in the future';
      }
    }

    // Quantity validation
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (formData.quantity > 10000) {
      newErrors.quantity = 'Quantity seems unrealistic (max 10000 liters)';
    }

    // Quality grade validation
    if (!formData.qualityGrade) {
      newErrors.qualityGrade = 'Quality grade is required';
    }

    // Fat content validation
    if (formData.fat_content < 0) {
      newErrors.fat_content = 'Fat content cannot be negative';
    } else if (formData.fat_content > 10) {
      newErrors.fat_content = 'Fat content seems unrealistic (max 10%)';
    }

    // SNF (Solids Not Fat) validation
    if (formData.snf < 0) {
      newErrors.snf = 'SNF cannot be negative';
    } else if (formData.snf > 15) {
      newErrors.snf = 'SNF seems unrealistic (max 15%)';
    }

    // Protein content validation
    if (formData.protein_content < 0) {
      newErrors.protein_content = 'Protein content cannot be negative';
    } else if (formData.protein_content > 10) {
      newErrors.protein_content = 'Protein content seems unrealistic (max 10%)';
    }

    // Temperature validation (in Celsius)
    if (formData.temperature < 0) {
      newErrors.temperature = 'Temperature cannot be negative';
    } else if (formData.temperature > 50) {
      newErrors.temperature = 'Temperature seems too high (max 50°C)';
    } else if (formData.temperature > 10) {
      newErrors.temperature = 'Warning: Temperature above 10°C may affect milk quality';
    }

    // pH level validation
    if (formData.ph_level < 0 || formData.ph_level > 14) {
      newErrors.ph_level = 'pH level must be between 0 and 14';
    } else if (formData.ph_level < 6.4 || formData.ph_level > 6.8) {
      newErrors.ph_level = 'Warning: Normal milk pH is 6.4-6.8';
    }

    // Payment amount validation
    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = 'Rate per liter must be greater than 0';
    } else if (formData.paymentAmount > 1000) {
      newErrors.paymentAmount = 'Rate per liter seems unrealistic (max 1000)';
    }

    // Notes validation (optional but with length limit)
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must not exceed 500 characters';
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
      const payload = { ...formData };
      if (collectionId) await api.put(`/delivery/milk-collection/${collectionId}`, payload);
      else await api.post('/delivery/milk-collection', payload);
      
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
            <label htmlFor="collectionDate">Collection Date <span className="required">*</span></label>
            <input type="date" id="collectionDate" name="collectionDate" value={formData.collectionDate} onChange={handleChange} />
            {errors.collectionDate && <span className="error">{errors.collectionDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity (L) <span className="required">*</span></label>
            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="0" step="0.01" />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="qualityGrade">Quality Grade</label>
            <select id="qualityGrade" name="qualityGrade" value={formData.qualityGrade} onChange={handleChange}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.qualityGrade && <span className="error">{errors.qualityGrade}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="collectionShift">Shift</label>
            <select id="collectionShift" name="collectionShift" value={formData.collectionShift} onChange={handleChange}>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select id="unit" name="unit" value={formData.unit} onChange={handleChange}>
              <option value="Liters">Liters</option>
              <option value="Gallons">Gallons</option>
            </select>
          </div>
        </div>
      </div>
      <div className="form-section">
        <h3>Quality & Metrics</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fat_content">Fat %</label>
            <input type="number" id="fat_content" name="fat_content" value={formData.fat_content} onChange={handleChange} min="0" max="100" step="0.1" />
          </div>
          <div className="form-group">
            <label htmlFor="snf">SNF %</label>
            <input type="number" id="snf" name="snf" value={formData.snf} onChange={handleChange} min="0" max="100" step="0.1" />
          </div>
          <div className="form-group">
            <label htmlFor="protein_content">Protein %</label>
            <input type="number" id="protein_content" name="protein_content" value={formData.protein_content} onChange={handleChange} min="0" max="100" step="0.1" />
          </div>
          <div className="form-group">
            <label htmlFor="temperature">Temp (°C)</label>
            <input type="number" id="temperature" name="temperature" value={formData.temperature} onChange={handleChange} step="0.1" />
          </div>
          <div className="form-group">
            <label htmlFor="ph_level">pH</label>
            <input type="number" id="ph_level" name="ph_level" value={formData.ph_level} onChange={handleChange} step="0.01" min="0" max="14" />
          </div>
          <div className="form-group">
            <label htmlFor="smell">Smell</label>
            <select id="smell" name="smell" value={formData.smell} onChange={handleChange}>
              <option value="Normal">Normal</option>
              <option value="Abnormal">Abnormal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment & Status</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentAmount">Rate per Liter (Rs) <span className="required">*</span></label>
            <input type="number" id="paymentAmount" name="paymentAmount" value={formData.paymentAmount} onChange={handleChange} min="0" step="0.1" />
            {errors.paymentAmount && <span className="error">{errors.paymentAmount}</span>}
          </div>
          <div className="form-group">
            <label>Total Value (Rs)</label>
            <input type="number" value={formData.totalValue.toFixed(2)} readOnly disabled />
          </div>
          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select id="paymentStatus" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Collected">Collected</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <div className="form-group">
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Enter any additional notes" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : collectionId ? 'Update Collection' : 'Create Collection'}</button>
      </div>
    </form>
  );
};

export default MilkCollectionForm;
