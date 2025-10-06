import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { ProductFormData, Product } from '../types/inventoryTypes';
import { productService } from '../services/inventoryApi';
import './InventoryMobileForm.css';

const MobileProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'Milk',
    description: '',
    price: '',
    stock: '',
    unit: 'Liters',
    manufactureDate: '',
    expiryDays: '7',
    batchNumber: '',
    supplier: 'N/A',
    image: '',
    minStockLevel: '',
    brand: 'Dairy Licious',
    isOrganic: false,
    fatContent: '',
    volume: '',
    featured: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [usedBatches, setUsedBatches] = useState<Set<string>>(new Set());

  // Generate batch numbers based on category
  const generateBatchNumbers = (category: string): string[] => {
    const prefix = category.substring(0, 2).toUpperCase();
    const batches: string[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    for (let i = 1; i <= 50; i++) {
      const batchNum = `${prefix}${currentYear}${currentMonth}${i.toString().padStart(3, '0')}`;
      batches.push(batchNum);
    }
    return batches;
  };

  // Fetch existing products to get used batch numbers
  useEffect(() => {
    const fetchUsedBatches = async () => {
      try {
        const products = await productService.getAllProducts();
        const used = new Set(products.map((p: Product) => p.batchNumber));
        setUsedBatches(used);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchUsedBatches();
  }, []);

  // Update available batches when category changes
  useEffect(() => {
    const batches = generateBatchNumbers(formData.category);
    setAvailableBatches(batches);
    setFormData(prev => ({ ...prev, batchNumber: '' }));
  }, [formData.category]);

  // No need to auto-calculate expiry date - using expiryDays directly

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.manufactureDate) {
      newErrors.manufactureDate = 'Manufacture date is required';
    }

    if (!formData.expiryDays) {
      newErrors.expiryDays = 'Expiry days is required';
    } else if (Number(formData.expiryDays) < 1) {
      newErrors.expiryDays = 'Expiry days must be at least 1';
    }

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }

    if (!formData.minStockLevel) {
      newErrors.minStockLevel = 'Minimum stock level is required';
    } else if (Number(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const productName = `${formData.category} - Batch ${formData.batchNumber}`;
      
      const submitData: ProductFormData = {
        ...formData,
        name: productName,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStockLevel: Number(formData.minStockLevel),
        expiryDays: Number(formData.expiryDays),
        fatContent: formData.fatContent ? Number(formData.fatContent) : undefined,
        volume: formData.volume ? Number(formData.volume) : undefined,
      };

      await productService.createProduct(submitData);
      
      toast.success('🎉 Product added successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
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
    <div className="mobile-form-page">
      <ToastContainer />
      
      <div className="mobile-header">
        <button className="back-btn" onClick={() => navigate('/products')}>
          <FaArrowLeft />
        </button>
        <div className="mobile-header-content">
          <img src="/dairy-licious-logo.png" alt="Logo" className="mobile-logo" />
          <h1>Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mobile-form">
        {/* 1. Name - Auto-generated preview */}
        <div className="mobile-form-group">
          <label>Name (Auto-generated)</label>
          <input
            type="text"
            value={formData.category && formData.batchNumber ? `${formData.category} - Batch ${formData.batchNumber}` : 'Will be generated'}
            disabled
            style={{ backgroundColor: '#f7fafc', opacity: 0.7 }}
          />
        </div>

        {/* 2. Description */}
        <div className="mobile-form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
          />
          {errors.description && <span className="mobile-error">{errors.description}</span>}
        </div>

        {/* 3. Price & 4. Category */}
        <div className="mobile-form-row">
          <div className="mobile-form-group">
            <label>Price (Rs) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <span className="mobile-error">{errors.price}</span>}
          </div>

          <div className="mobile-form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Milk">Milk</option>
              <option value="Yogurt">Yogurt</option>
              <option value="Cheese">Cheese</option>
              <option value="Butter">Butter</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Cream">Cream</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* 5. Image URL */}
        <div className="mobile-form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 6. Stock & 7. Unit */}
        <div className="mobile-form-row">
          <div className="mobile-form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
            {errors.stock && <span className="mobile-error">{errors.stock}</span>}
          </div>

          <div className="mobile-form-group">
            <label>Unit *</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="Liters">Liters</option>
              <option value="Kilograms">Kilograms</option>
              <option value="Pieces">Pieces</option>
              <option value="Bottles">Bottles</option>
              <option value="Packets">Packets</option>
            </select>
          </div>
        </div>

        {/* 8. Brand */}
        <div className="mobile-form-group">
          <label>Brand *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g., Dairy Licious"
          />
        </div>

        {/* 9. Manufacture Date & 10. Expiry Days */}
        <div className="mobile-form-row">
          <div className="mobile-form-group">
            <label>Manufacture Date *</label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.manufactureDate && <span className="mobile-error">{errors.manufactureDate}</span>}
          </div>

          <div className="mobile-form-group">
            <label>Expiry Days *</label>
            <input
              type="number"
              name="expiryDays"
              value={formData.expiryDays}
              onChange={handleChange}
              placeholder="7"
              min="1"
            />
            <small style={{ color: '#718096', fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Shelf life in days
            </small>
            {errors.expiryDays && <span className="mobile-error">{errors.expiryDays}</span>}
          </div>
        </div>

        {/* 11. Min Stock Level */}
        <div className="mobile-form-group">
          <label>Min Stock Level *</label>
          <input
            type="number"
            name="minStockLevel"
            value={formData.minStockLevel}
            onChange={handleChange}
            placeholder="10"
            min="0"
          />
          {errors.minStockLevel && <span className="mobile-error">{errors.minStockLevel}</span>}
        </div>

        {/* Batch Number */}
        <div className="mobile-form-group">
          <label>Batch Number *</label>
          <select
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
          >
            <option value="">-- Select Batch --</option>
            {availableBatches.map((batch) => {
              const isUsed = usedBatches.has(batch);
              return (
                <option 
                  key={batch} 
                  value={batch}
                  disabled={isUsed}
                  style={{ 
                    color: isUsed ? '#999' : 'inherit',
                  }}
                >
                  {batch} {isUsed ? '(Used)' : ''}
                </option>
              );
            })}
          </select>
          {errors.batchNumber && <span className="mobile-error">{errors.batchNumber}</span>}
          <small style={{ color: '#718096', fontSize: '11px', marginTop: '4px', display: 'block' }}>
            Format: {formData.category.substring(0, 2).toUpperCase()}YYYYMM###
          </small>
        </div>

        {/* 12. Is Organic */}
        <div className="mobile-form-group">
          <label className="mobile-checkbox-label">
            <input
              type="checkbox"
              name="isOrganic"
              checked={formData.isOrganic}
              onChange={(e) => setFormData(prev => ({ ...prev, isOrganic: e.target.checked }))}
            />
            <span>Organic Product</span>
          </label>
        </div>

        {/* 13. Fat Content & 14. Volume */}
        <div className="mobile-form-row">
          <div className="mobile-form-group">
            <label>Fat Content (%)</label>
            <input
              type="number"
              name="fatContent"
              value={formData.fatContent}
              onChange={handleChange}
              placeholder="e.g., 3.5"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="mobile-form-group">
            <label>Volume</label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Featured */}
        <div className="mobile-form-group">
          <label className="mobile-checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            />
            <span>Featured Product (Show in Shop)</span>
          </label>
        </div>

        <motion.button
          type="submit"
          className="mobile-submit-btn"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <div className="mobile-spinner" />
              Adding...
            </>
          ) : (
            <>
              <FaCheck /> Add Product
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default MobileProductForm;
