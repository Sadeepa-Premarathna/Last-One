import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { FaSave } from 'react-icons/fa';
import { Farmer, APIResponse, FormErrors } from '../../types';

interface FarmerFormProps {
  farmerId?: string | null;
  onSuccess?: () => void;
}

interface FarmerFormData {
  farmerId: string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  address: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  numberOfCows: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch: string;
  };
}

const FarmerForm: React.FC<FarmerFormProps> = ({ farmerId: propFarmerId, onSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const farmerId = propFarmerId || id || null;
  const isEdit = Boolean(farmerId);

  const [formData, setFormData] = useState<FarmerFormData>({
    farmerId: '',
    firstName: '',
    lastName: '',
    nic: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      district: '',
      postalCode: ''
    },
    numberOfCows: 0,
    status: 'Active',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      branch: ''
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchFarmer = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Farmer>>(`/farmers/${farmerId}`);
      const farmerData = response.data.data || response.data;
      setFormData(farmerData as FarmerFormData);
    } catch (err: any) {
      setError('Failed to fetch farmer details');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchFarmer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId, isEdit]);

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
          ...(prev[parent as keyof FarmerFormData] as any),
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
    if (!formData.farmerId.trim()) {
      newErrors.farmerId = 'Farmer ID is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // NIC validation (Sri Lankan format)
    const nicPattern = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicPattern.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format (9 digits + V or 12 digits)';
    }

    // Contact number validation
    const phonePattern = /^(\+94|0)?[0-9]{9}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!phonePattern.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Invalid phone number (10 digits)';
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

    // Number of cows validation
    if (formData.numberOfCows <= 0) {
      newErrors.numberOfCows = 'Number of cows must be greater than 0';
    }

    // Bank details validation
    if (!formData.bankDetails.bankName.trim()) {
      newErrors['bankDetails.bankName'] = 'Bank name is required';
    }
    if (!formData.bankDetails.accountNumber.trim()) {
      newErrors['bankDetails.accountNumber'] = 'Account number is required';
    }
    if (!formData.bankDetails.accountHolderName.trim()) {
      newErrors['bankDetails.accountHolderName'] = 'Account holder name is required';
    }
    if (!formData.bankDetails.branch.trim()) {
      newErrors['bankDetails.branch'] = 'Branch is required';
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
        await api.put(`/farmers/${farmerId}`, formData);
        alert('Farmer updated successfully!');
      } else {
        await api.post('/farmers', formData);
        alert('Farmer registered successfully!');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/farmers');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save farmer. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-modal">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Farmer ID *</label>
            <input
              type="text"
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              disabled={isEdit}
              className={errors.farmerId ? 'error' : ''}
            />
            {errors.farmerId && <span className="error-text">{errors.farmerId}</span>}
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

          <div className="form-group">
            <label>Number of Cows *</label>
            <input
              type="number"
              name="numberOfCows"
              value={formData.numberOfCows}
              onChange={handleChange}
              min="0"
              className={errors.numberOfCows ? 'error' : ''}
            />
            {errors.numberOfCows && <span className="error-text">{errors.numberOfCows}</span>}
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#2a5298' }}>Address</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Street *</label>
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

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#1f2937' }}>Bank Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Bank Name *</label>
            <input
              type="text"
              name="bankDetails.bankName"
              value={formData.bankDetails.bankName}
              onChange={handleChange}
              className={errors['bankDetails.bankName'] ? 'error' : ''}
            />
            {errors['bankDetails.bankName'] && <span className="error-text">{errors['bankDetails.bankName']}</span>}
          </div>

          <div className="form-group">
            <label>Account Number *</label>
            <input
              type="text"
              name="bankDetails.accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={handleChange}
              className={errors['bankDetails.accountNumber'] ? 'error' : ''}
            />
            {errors['bankDetails.accountNumber'] && <span className="error-text">{errors['bankDetails.accountNumber']}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Account Holder Name *</label>
            <input
              type="text"
              name="bankDetails.accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={handleChange}
              className={errors['bankDetails.accountHolderName'] ? 'error' : ''}
            />
            {errors['bankDetails.accountHolderName'] && <span className="error-text">{errors['bankDetails.accountHolderName']}</span>}
          </div>

          <div className="form-group">
            <label>Branch *</label>
            <input
              type="text"
              name="bankDetails.branch"
              value={formData.bankDetails.branch}
              onChange={handleChange}
              className={errors['bankDetails.branch'] ? 'error' : ''}
            />
            {errors['bankDetails.branch'] && <span className="error-text">{errors['bankDetails.branch']}</span>}
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : (isEdit ? 'Update Farmer' : 'Register Farmer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerForm;
