import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import { Product, ProductFormData } from '../Inventorytypes/inventoryTypes';
import { productService } from '../Inventoryservices/inventoryApi';
import './InventoryForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  const initialFormData: ProductFormData = {
    name: '',
    category: 'Milk',
    description: '',
    price: '',
    stock: '',
    unit: 'Liters',
    manufactureDate: '',
    expiryDays: '7',
    batchNumber: '',
    image: '',
    minStockLevel: '',
    brand: 'Dairy Licious',
    isOrganic: false,
    fatContent: '',
    volume: '',
    featured: false,
    supplier: ''
  };

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [usedBatches, setUsedBatches] = useState<Set<string>>(new Set());

  // Generate batch numbers based on category
  const generateBatchNumbers = (category: string): string[] => {
    const prefix = category.substring(0, 2).toUpperCase();
    const batches: string[] = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Generate 50 batch numbers for this category
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
    
    // Reset batch number when category changes (only for new products)
    if (!product) {
      setFormData(prev => ({ ...prev, batchNumber: '' }));
    }
  }, [formData.category, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        manufactureDate: product.manufactureDate.split('T')[0],
        expiryDays: product.expiryDays || 7,
        batchNumber: product.batchNumber,
        supplier: product.supplier,
        image: product.image,
        minStockLevel: product.minStockLevel,
        brand: product.brand || 'Dairy Licious',
        isOrganic: product.isOrganic || false,
        fatContent: product.fatContent || '',
        volume: product.volume || '',
        featured: product.featured || false
      });
      setImagePreview(product.image);
    }
  }, [product]);

  // No need to auto-calculate expiry date anymore - using expiryDays directly

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Image uploaded, size:', base64String.length, 'bytes');
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, image: 'Failed to read image file' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
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
      return;
    }

    setLoading(true);
    try {
      // Auto-generate product name from category and batch number
      const productName = `${formData.category} - Batch ${formData.batchNumber}`;
      
      // Convert string values to proper types before submission
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
      
      await onSubmit(submitData);
      
      // Close form after successful submission (both add and edit)
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
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
          className="modal-content"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              {/* 1. Name - Auto-generated, shown as info */}
              <div className="form-group full-width">
                <label>Name (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.category && formData.batchNumber ? `${formData.category} - Batch ${formData.batchNumber}` : 'Will be generated automatically'}
                  disabled
                  style={{ backgroundColor: '#f7fafc', cursor: 'not-allowed' }}
                />
              </div>

              {/* 2. Description */}
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                  maxLength={500}
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>

              {/* 3. Price */}
              <div className="form-group">
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
                {errors.price && <span className="error">{errors.price}</span>}
              </div>

              {/* 4. Category */}
              <div className="form-group">
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

              {/* 5. Image */}
              <div className="form-group full-width">
                <label>Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Product preview" />
                    ) : (
                      <div className="no-image">
                        <FaImage size={40} />
                        <p>No image selected</p>
                      </div>
                    )}
                  </div>
                  <div className="image-upload-controls">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="imageUpload" className="btn-upload">
                      <FaUpload /> Upload Image
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image.startsWith('data:') ? 'Image uploaded' : formData.image}
                      onChange={handleChange}
                      placeholder="Or paste image URL"
                      className="image-url-input"
                      disabled={formData.image.startsWith('data:')}
                    />
                  </div>
                </div>
                {errors.image && <span className="error">{errors.image}</span>}
              </div>

              {/* 6. Stock */}
              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <span className="error">{errors.stock}</span>}
              </div>

              {/* 7. Unit */}
              <div className="form-group">
                <label>Unit *</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="Liters">Liters</option>
                  <option value="Kilograms">Kilograms</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Packets">Packets</option>
                </select>
              </div>

              {/* 8. Brand */}
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Dairy Licious"
                />
              </div>

              {/* 9. Manufacture Date */}
              <div className="form-group">
                <label>Manufacture Date *</label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={formData.manufactureDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.manufactureDate && <span className="error">{errors.manufactureDate}</span>}
              </div>

              {/* 10. Expiry Days */}
              <div className="form-group">
                <label>Expiry Days *</label>
                <input
                  type="number"
                  name="expiryDays"
                  value={formData.expiryDays}
                  onChange={handleChange}
                  placeholder="7"
                  min="1"
                />
                <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Shelf life in days from manufacture date
                </small>
                {errors.expiryDays && <span className="error">{errors.expiryDays}</span>}
              </div>

              {/* 11. Min Stock Level */}
              <div className="form-group">
                <label>Min Stock Level *</label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                />
                {errors.minStockLevel && <span className="error">{errors.minStockLevel}</span>}
              </div>

              {/* Batch Number */}
              <div className="form-group">
                <label>Batch Number *</label>
                <select
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  disabled={!!product}
                >
                  <option value="">-- Select Batch Number --</option>
                  {availableBatches.map((batch) => {
                    const isUsed = usedBatches.has(batch) && batch !== product?.batchNumber;
                    return (
                      <option 
                        key={batch} 
                        value={batch}
                        disabled={isUsed}
                        style={{ 
                          color: isUsed ? '#999' : 'inherit',
                          fontStyle: isUsed ? 'italic' : 'normal'
                        }}
                      >
                        {batch} {isUsed ? '(Used)' : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.batchNumber && <span className="error">{errors.batchNumber}</span>}
                <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Format: {formData.category.substring(0, 2).toUpperCase()}YYYYMM### (e.g., MI202410001)
                </small>
              </div>

              {/* 12. Is Organic */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isOrganic: e.target.checked }))}
                  />
                  <span>Organic Product</span>
                </label>
              </div>

              {/* 13. Fat Content */}
              <div className="form-group">
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

              {/* 14. Volume */}
              <div className="form-group">
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

              {/* Featured - Additional field */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <span>Featured Product (Show in Shop)</span>
                </label>
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
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductForm;
