import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaExclamationTriangle, FaFileAlt, FaBrain, FaQrcode } from 'react-icons/fa';
import { toast } from 'react-toastify';
import InventoryCard from '../Inventorycomponents/InventoryCard';
import InventoryForm from '../Inventorycomponents/InventoryForm';
import InventoryReport from '../Inventorycomponents/InventoryReport';
import InventoryAIInsights from '../Inventorycomponents/InventoryAIInsights';
import InventoryQRCode from '../Inventorycomponents/InventoryQRCode';
import { Product, ProductFormData } from '../Inventorytypes/inventoryTypes';
import { productService } from '../Inventoryservices/inventoryApi';
import './InventoryProducts.css';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchExpiringProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringProducts = async () => {
    try {
      const data = await productService.getExpiringProducts();
      setExpiringProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (formData: ProductFormData) => {
    try {
      await productService.createProduct(formData);
      toast.success('🎉 Product added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchProducts();
      fetchExpiringProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleUpdate = async (formData: ProductFormData) => {
    if (!selectedProduct) return;
    
    try {
      await productService.updateProduct(selectedProduct._id, formData);
      toast.success('✅ Product updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchProducts();
      fetchExpiringProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      fetchProducts();
      fetchExpiringProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  return (
    <div className="products-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Product Inventory</h1>
          <p>Manage your dairy product inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <motion.button
            className="btn-ai"
            onClick={() => setShowAIAnalyzer(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBrain /> Licious AI
          </motion.button>
          <motion.button
            className="btn-report"
            onClick={() => setShowReport(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileAlt /> Generate Report
          </motion.button>
          <motion.button
            className="btn-qr"
            onClick={() => setShowQRCode(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Add product from mobile"
          >
            <FaQrcode /> Mobile Add
          </motion.button>
          <motion.button
            className="btn-add"
            onClick={handleAddNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add New Product
          </motion.button>
        </div>
      </motion.div>

      {expiringProducts.length > 0 && (
        <motion.div
          className="expiring-alert"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaExclamationTriangle />
          <span>
            {expiringProducts.length} product{expiringProducts.length > 1 ? 's' : ''} expiring within 7 days!
          </span>
        </motion.div>
      )}

      {loading ? (
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon">📦</div>
          <h2>No Products Yet</h2>
          <p>Start by adding your first product to the inventory</p>
          <motion.button
            className="btn-add-large"
            onClick={handleAddNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add Your First Product
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="products-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <InventoryCard
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {showForm && (
        <InventoryForm
          product={selectedProduct}
          onSubmit={selectedProduct ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}

      {showReport && (
        <InventoryReport
          products={products}
          reportType="all"
          onClose={() => setShowReport(false)}
        />
      )}

      {showAIAnalyzer && (
        <InventoryAIInsights
          products={products}
          onClose={() => setShowAIAnalyzer(false)}
        />
      )}

      {showQRCode && (
        <InventoryQRCode
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
};

export default Products;
