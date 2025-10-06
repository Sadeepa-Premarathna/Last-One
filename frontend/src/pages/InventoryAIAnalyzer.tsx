import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Product } from '../types/inventoryTypes';
import { productService } from '../services/inventoryApi';
import InventoryAIInsights from '../components/InventoryAIInsights';
import './InventoryAIAnalyzer.css';

const AIAnalyzerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      if (data.length > 0) {
        setShowAnalyzer(true);
      }
    } catch (error) {
      toast.error('Failed to fetch products for analysis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-analyzer-page">
      <motion.div
        className="page-header-ai"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-icon">
            <FaBrain />
          </div>
          <div className="header-text">
            <h1>Licious AI</h1>
            <p>Intelligent insights and predictions powered by advanced analytics</p>
          </div>
        </div>
        <motion.button
          className="btn-refresh"
          onClick={fetchProducts}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRedo /> Refresh Data
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="loading-state">
          <motion.div
            className="loading-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <FaBrain />
          </motion.div>
          <h3>Loading inventory data...</h3>
          <p>Preparing AI analysis</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          className="empty-state-ai"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaBrain className="empty-icon" />
          <h2>No Products Found</h2>
          <p>Add products to your inventory to enable AI analysis</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="info-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="banner-icon">
              <FaBrain />
            </div>
            <div className="banner-content">
              <h3>Licious AI Analysis Ready</h3>
              <p>
                Analyzing <strong>{products.length} products</strong> in your inventory. 
                Licious AI will provide insights on expiry dates, stock levels, predictions, 
                efficiency scores, and actionable recommendations.
              </p>
            </div>
          </motion.div>

          {showAnalyzer && (
            <div className="analyzer-container">
              <InventoryAIInsights
                products={products}
                onClose={() => {
                  // Don't close on this page, just stay open
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIAnalyzerPage;
