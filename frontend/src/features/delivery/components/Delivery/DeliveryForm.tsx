import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import { Driver, APIResponse, FormErrors } from '../../types';

interface DeliveryFormProps {
  deliveryId?: string | null;
  onSuccess?: () => void;
}

interface ProductItem {
  productName: string;
  productType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

interface DeliveryFormData {
  deliveryId: string;
  driver: string;
  deliveryDate: string;
  customer: {
    name: string;
    contactNumber: string;
    address: {
      street: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };
  products: ProductItem[];
  deliveryStatus: 'Pending' | 'In Transit' | 'Delivered' | 'Failed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Partial' | 'Refunded';
  paymentMethod: 'Cash' | 'Card' | 'Online Transfer' | 'Credit';
  route: string;
  notes: string;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ deliveryId: propDeliveryId, onSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deliveryId = propDeliveryId || id || null;
  const isEdit = Boolean(deliveryId);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState<DeliveryFormData>({
    deliveryId: '',
    driver: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    customer: {
      name: '',
      contactNumber: '',
      address: {
        street: '',
        city: '',
        district: '',
        postalCode: ''
      }
    },
    products: [{
      productName: '',
      productType: 'Fresh Milk',
      quantity: 1,
      unit: 'Liters',
      pricePerUnit: 0,
      totalPrice: 0
    }],
    deliveryStatus: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    route: '',
    notes: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const fetchDrivers = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Driver[]>>('/drivers/status/active');
      setDrivers(response.data.data || response.data);
    } catch (err: any) {
      console.error('Error fetching drivers:', err);
    }
  };

  const fetchDelivery = async (): Promise<void> => {
    try {
      const response = await api.get(`/deliveries/${deliveryId}`);
      const delivery = response.data.data;
      setFormData({
        ...delivery,
        driver: typeof delivery.driver === 'object' ? delivery.driver._id : delivery.driver || '',
        deliveryDate: new Date(delivery.deliveryDate).toISOString().split('T')[0]
      });
    } catch (err: any) {
      setError('Failed to fetch delivery details');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    if (isEdit) {
      fetchDelivery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryId, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow digits and limit to 10
    if (name === 'customer.contactNumber') {
      const cleanedValue = value.replace(/\D/g, ''); // Remove non-digits
      if (cleanedValue.length > 10) {
        return; // Don't update if more than 10 digits
      }
      
      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          contactNumber: cleanedValue
        }
      }));
      return;
    }
    
    if (name.startsWith('customer.')) {
      const field = name.split('.').slice(1);
      if (field[0] === 'address') {
        setFormData(prev => ({
          ...prev,
          customer: {
            ...prev.customer,
            address: {
              ...prev.customer.address,
              [field[1]]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          customer: {
            ...prev.customer,
            [field[0]]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number): void => {
    const updatedProducts = [...formData.products];
    (updatedProducts[index] as any)[field] = value;
    
    // Calculate totalPrice
    if (field === 'quantity' || field === 'pricePerUnit') {
      updatedProducts[index].totalPrice = 
        parseFloat(String(updatedProducts[index].quantity || 0)) * 
        parseFloat(String(updatedProducts[index].pricePerUnit || 0));
    }
    
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = (): void => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        productName: '',
        productType: 'Fresh Milk',
        quantity: 1,
        unit: 'Liters',
        pricePerUnit: 0,
        totalPrice: 0
      }]
    }));
  };

  const removeProduct = (index: number): void => {
    if (formData.products.length > 1) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Delivery ID validation
    if (!formData.deliveryId.trim()) {
      newErrors.deliveryId = 'Delivery ID is required';
    } else if (formData.deliveryId.trim().length < 3) {
      newErrors.deliveryId = 'Delivery ID must be at least 3 characters';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.deliveryId)) {
      newErrors.deliveryId = 'Delivery ID can only contain letters, numbers, and hyphens';
    }

    // Driver validation
    if (!formData.driver) {
      newErrors.driver = 'Driver is required';
    }

    // Delivery date validation
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else {
      const deliveryDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureLimit = new Date();
      futureLimit.setDate(futureLimit.getDate() + 30);
      
      if (deliveryDate > futureLimit) {
        newErrors.deliveryDate = 'Delivery date cannot be more than 30 days in the future';
      }
    }

    // Customer name validation
    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = 'Customer name is required';
    } else if (formData.customer.name.trim().length < 2) {
      newErrors['customer.name'] = 'Customer name must be at least 2 characters';
    } else if (formData.customer.name.trim().length > 100) {
      newErrors['customer.name'] = 'Customer name is too long (max 100 characters)';
    }
    
    // Contact number validation (exactly 10 digits)
    const cleanPhone = formData.customer.contactNumber.replace(/\s|-/g, '');
    if (!formData.customer.contactNumber.trim()) {
      newErrors['customer.contactNumber'] = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      newErrors['customer.contactNumber'] = 'Contact number must be exactly 10 digits';
    } else if (!cleanPhone.startsWith('0')) {
      newErrors['customer.contactNumber'] = 'Contact number must start with 0';
    }

    // Customer address validation
    if (!formData.customer.address.street.trim()) {
      newErrors['customer.address.street'] = 'Street address is required';
    } else if (formData.customer.address.street.trim().length < 5) {
      newErrors['customer.address.street'] = 'Street address must be at least 5 characters';
    }

    if (!formData.customer.address.city.trim()) {
      newErrors['customer.address.city'] = 'City is required';
    } else if (formData.customer.address.city.trim().length < 2) {
      newErrors['customer.address.city'] = 'City must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(formData.customer.address.city)) {
      newErrors['customer.address.city'] = 'City can only contain letters';
    }

    if (formData.customer.address.district && formData.customer.address.district.trim()) {
      if (!/^[A-Za-z\s]+$/.test(formData.customer.address.district)) {
        newErrors['customer.address.district'] = 'District can only contain letters';
      }
    }

    // Postal code validation
    if (formData.customer.address.postalCode && formData.customer.address.postalCode.trim()) {
      if (!/^[0-9]{5}$/.test(formData.customer.address.postalCode.trim())) {
        newErrors['customer.address.postalCode'] = 'Postal code must be 5 digits';
      }
    }

    // Products validation
    if (formData.products.length === 0) {
      newErrors.products = 'At least one product is required';
    }

    formData.products.forEach((product, index) => {
      if (!product.productName.trim()) {
        newErrors[`product.${index}.productName`] = 'Product name is required';
      } else if (product.productName.trim().length < 2) {
        newErrors[`product.${index}.productName`] = 'Product name must be at least 2 characters';
      }

      if (!product.quantity || product.quantity <= 0) {
        newErrors[`product.${index}.quantity`] = 'Quantity must be greater than 0';
      } else if (product.quantity > 10000) {
        newErrors[`product.${index}.quantity`] = 'Quantity seems unrealistic (max 10000)';
      }

      if (!product.pricePerUnit || product.pricePerUnit <= 0) {
        newErrors[`product.${index}.pricePerUnit`] = 'Price must be greater than 0';
      } else if (product.pricePerUnit > 100000) {
        newErrors[`product.${index}.pricePerUnit`] = 'Price seems unrealistic (max 100000)';
      }
    });

    // Route validation (optional but with rules if provided)
    if (formData.route && formData.route.trim()) {
      if (formData.route.trim().length < 3) {
        newErrors.route = 'Route must be at least 3 characters';
      } else if (formData.route.trim().length > 100) {
        newErrors.route = 'Route is too long (max 100 characters)';
      }
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
    
    // Validate form before submitting
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/deliveries/${deliveryId}`, formData);
        alert('Delivery updated successfully!');
      } else {
        await api.post('/deliveries', formData);
        alert('Delivery created successfully!');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/deliveries');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save delivery. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-modal">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Delivery Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Delivery ID *</label>
            <input
              type="text"
              name="deliveryId"
              value={formData.deliveryId}
              onChange={handleChange}
              disabled={isEdit}
              className={errors.deliveryId ? 'error' : ''}
            />
            {errors.deliveryId && <span className="error-text">{errors.deliveryId}</span>}
          </div>

          <div className="form-group">
            <label>Driver *</label>
            <select name="driver" value={formData.driver} onChange={handleChange} className={errors.driver ? 'error' : ''}>
              <option value="">Select Driver</option>
              {drivers.map((driver: Driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName} - {driver.vehicleNumber}
                </option>
              ))}
            </select>
            {errors.driver && <span className="error-text">{errors.driver}</span>}
          </div>

          <div className="form-group">
            <label>Delivery Date *</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className={errors.deliveryDate ? 'error' : ''}
            />
            {errors.deliveryDate && <span className="error-text">{errors.deliveryDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Route</label>
            <input
              type="text"
              name="route"
              value={formData.route}
              onChange={handleChange}
              placeholder="e.g., Colombo - Kandy"
            />
          </div>

          <div className="form-group">
            <label>Delivery Status *</label>
            <select name="deliveryStatus" value={formData.deliveryStatus} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Status *</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method *</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online Transfer">Online Transfer</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#2a5298' }}>Customer Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customer.name"
              value={formData.customer.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="customer.contactNumber"
              value={formData.customer.contactNumber}
              onChange={handleChange}
              placeholder="0771234567"
              maxLength={10}
              pattern="[0-9]{10}"
              required
              className={errors['customer.contactNumber'] ? 'error' : ''}
            />
            {errors['customer.contactNumber'] && <span className="error-text">{errors['customer.contactNumber']}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="customer.address.street"
              value={formData.customer.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="customer.address.city"
              value={formData.customer.address.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>District</label>
            <input
              type="text"
              name="customer.address.district"
              value={formData.customer.address.district}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#2a5298' }}>
          Products
          <button type="button" className="btn btn-primary" onClick={addProduct} style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>
            <FaPlus /> Add Product
          </button>
        </h3>

        {formData.products.map((product, index) => (
          <div key={index} style={{ border: '2px solid #e0e0e0', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4>Product {index + 1}</h4>
              {formData.products.length > 1 && (
                <button type="button" className="btn btn-danger" onClick={() => removeProduct(index)}>
                  <FaTimes /> Remove
                </button>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={product.productName}
                  onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                  className={errors[`product.${index}.productName`] ? 'error' : ''}
                />
                {errors[`product.${index}.productName`] && <span className="error-text">{errors[`product.${index}.productName`]}</span>}
              </div>

              <div className="form-group">
                <label>Product Type *</label>
                <select
                  value={product.productType}
                  onChange={(e) => handleProductChange(index, 'productType', e.target.value)}
                >
                  <option value="Fresh Milk">Fresh Milk</option>
                  <option value="Curd">Curd</option>
                  <option value="Yogurt">Yogurt</option>
                  <option value="Cheese">Cheese</option>
                  <option value="Butter">Butter</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', parseFloat(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className={errors[`product.${index}.quantity`] ? 'error' : ''}
                />
                {errors[`product.${index}.quantity`] && <span className="error-text">{errors[`product.${index}.quantity`]}</span>}
              </div>

              <div className="form-group">
                <label>Unit *</label>
                <select
                  value={product.unit}
                  onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                >
                  <option value="Liters">Liters</option>
                  <option value="Kilograms">Kilograms</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Packets">Packets</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price per Unit (Rs.) *</label>
                <input
                  type="number"
                  value={product.pricePerUnit}
                  onChange={(e) => handleProductChange(index, 'pricePerUnit', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className={errors[`product.${index}.pricePerUnit`] ? 'error' : ''}
                />
                {errors[`product.${index}.pricePerUnit`] && <span className="error-text">{errors[`product.${index}.pricePerUnit`]}</span>}
              </div>

              <div className="form-group">
                <label>Total Price (Rs.)</label>
                <input
                  type="number"
                  value={product.totalPrice}
                  readOnly
                  style={{ background: '#f0f0f0' }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes or instructions..."
          />
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <h3 style={{ color: '#2a5298' }}>
            Total Amount: Rs. {formData.products.reduce((sum, p) => sum + (p.totalPrice || 0), 0).toFixed(2)}
          </h3>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : (isEdit ? 'Update Delivery' : 'Create Delivery')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
