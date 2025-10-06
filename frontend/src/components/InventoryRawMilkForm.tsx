import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { RawMilk, RawMilkFormData } from '../types';
import { rawMilkService } from '../services/api';
import './RawMilkForm.css';

interface RawMilkFormProps {
  record?: RawMilk | null;
  onSubmit: () => void;
  onClose: () => void;
}

const RawMilkForm = ({ record, onSubmit, onClose }: RawMilkFormProps) => {
  const [formData, setFormData] = useState<RawMilkFormData>({
    supplierName: '',
    contactNumber: '',
    collectionDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'Liters',
    fatContent: '',
    quality: 'A',
    pricePerLiter: '0',
    totalAmount: '0',
    location: '',
    notes: '',
    paymentStatus: 'pending'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        supplierName: record.supplierName,
        contactNumber: record.contactNumber,
        collectionDate: record.collectionDate.split('T')[0],
        quantity: record.quantity,
        unit: record.unit,
        fatContent: record.fatContent,
        quality: record.quality,
        pricePerLiter: '0',
        totalAmount: '0',
        location: record.location,
        notes: record.notes || '',
        paymentStatus: 'pending'
      });
    }
  }, [record]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.fatContent) {
      newErrors.fatContent = 'Fat content is required';
    } else if (Number(formData.fatContent) < 0 || Number(formData.fatContent) > 100) {
      newErrors.fatContent = 'Fat content must be between 0-100%';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        quantity: Number(formData.quantity),
        fatContent: Number(formData.fatContent),
        pricePerLiter: 0,
        totalAmount: 0
      };

      if (record) {
        await rawMilkService.updateRawMilk(record._id, submitData);
        toast.success('✅ Collection updated successfully!');
      } else {
        await rawMilkService.createRawMilk(submitData);
        toast.success('🎉 Collection added successfully!');
      }

      onSubmit();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content rawmilk-modal"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{record ? 'Edit Collection' : 'Add New Collection'}</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="rawmilk-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                />
                {errors.supplierName && <span className="error">{errors.supplierName}</span>}
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g., 0771234567"
                />
                {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
              </div>

              <div className="form-group">
                <label>Collection Date *</label>
                <input
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
                {errors.quantity && <span className="error">{errors.quantity}</span>}
              </div>

              <div className="form-group">
                <label>Unit *</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="Liters">Liters</option>
                  <option value="Kilograms">Kilograms</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fat Content (%) *</label>
                <input
                  type="number"
                  name="fatContent"
                  value={formData.fatContent}
                  onChange={handleChange}
                  placeholder="e.g., 3.5"
                  step="0.1"
                  min="0"
                  max="100"
                />
                {errors.fatContent && <span className="error">{errors.fatContent}</span>}
              </div>

              <div className="form-group">
                <label>Quality Grade *</label>
                <select name="quality" value={formData.quality} onChange={handleChange}>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Basic)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter collection location"
                />
                {errors.location && <span className="error">{errors.location}</span>}
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes (optional)"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-actions">
              <motion.button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn-submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Saving...' : (record ? 'Update Collection' : 'Add Collection')}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RawMilkForm;
