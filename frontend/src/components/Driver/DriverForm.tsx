import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { FaSave } from 'react-icons/fa';
import { Driver, APIResponse, FormErrors } from '../../types';

interface DriverFormProps {
  driverId?: string | null;
  onSuccess?: () => void;
}

interface DriverFormData {
  driverId: string;
  firstName: string;
  lastName: string;
  nic: string;
  licenseNumber: string;
  contactNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  vehicleNumber: string;
  vehicleType: 'Van' | 'Truck' | 'Motorcycle' | 'Three-wheeler';
  status: 'Active' | 'Inactive' | 'On Leave';
  assignedRoute: string;
}

const DriverForm: React.FC<DriverFormProps> = ({ driverId: propDriverId, onSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const driverId = propDriverId || id || null;
  const isEdit = Boolean(driverId);

  const [formData, setFormData] = useState<DriverFormData>({
    driverId: '',
    firstName: '',
    lastName: '',
    nic: '',
    licenseNumber: '',
    contactNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      district: '',
      postalCode: ''
    },
    vehicleNumber: '',
    vehicleType: 'Van',
    status: 'Active',
    assignedRoute: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchDriver = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Driver>>(`/drivers/${driverId}`);
      const driverData = response.data.data || response.data;
      setFormData(driverData as DriverFormData);
    } catch (err: any) {
      setError('Failed to fetch driver details');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchDriver();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof DriverFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.driverId.trim()) {
      newErrors.driverId = 'Driver ID is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // NIC validation (Sri Lankan format: 9 digits + V or 12 digits)
    const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicPattern.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format (9 digits + V or 12 digits)';
    }

    // License number validation
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    // Contact number validation (Sri Lankan format)
    const phonePattern = /^(\+94|0)?[0-9]{9}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phonePattern.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Invalid phone number (10 digits)';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.district.trim()) {
      newErrors['address.district'] = 'District is required';
    }

    // Vehicle validation
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/drivers/${driverId}`, formData);
        alert('Driver updated successfully!');
      } else {
        await api.post('/drivers', formData);
        alert('Driver created successfully!');
      }
      
      // Call onSuccess callback if provided (for modal usage), otherwise navigate to list
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/drivers');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save driver. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-modal">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Driver ID *</label>
            <input
              type="text"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              disabled={isEdit}
              className={errors.driverId ? 'error' : ''}
            />
            {errors.driverId && <span className="error-text">{errors.driverId}</span>}
          </div>

          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>NIC *</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="9 digits + V or 12 digits"
              className={errors.nic ? 'error' : ''}
            />
            {errors.nic && <span className="error-text">{errors.nic}</span>}
          </div>

          <div className="form-group">
            <label>License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className={errors.licenseNumber ? 'error' : ''}
            />
            {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="0771234567"
              className={errors.contactNumber ? 'error' : ''}
            />
            {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="driver@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Vehicle Number *</label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="ABC-1234"
              className={errors.vehicleNumber ? 'error' : ''}
            />
            {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
          </div>

          <div className="form-group">
            <label>Vehicle Type *</label>
            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Three-wheeler">Three-wheeler</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className={errors['address.street'] ? 'error' : ''}
            />
            {errors['address.street'] && <span className="error-text">{errors['address.street']}</span>}
          </div>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className={errors['address.city'] ? 'error' : ''}
            />
            {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>District *</label>
            <input
              type="text"
              name="address.district"
              value={formData.address.district}
              onChange={handleChange}
              className={errors['address.district'] ? 'error' : ''}
            />
            {errors['address.district'] && <span className="error-text">{errors['address.district']}</span>}
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned Route</label>
            <input
              type="text"
              name="assignedRoute"
              value={formData.assignedRoute}
              onChange={handleChange}
              placeholder="e.g., Colombo - Kandy"
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : (isEdit ? 'Update Driver' : 'Create Driver')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
