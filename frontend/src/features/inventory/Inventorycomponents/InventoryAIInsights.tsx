import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaTimes,
  FaCheckCircle,
  FaBox,
  FaClock,
  FaArrowUp
} from 'react-icons/fa';
import { Product } from '../Inventorytypes/inventoryTypes';
import { formatCurrency, formatDate } from '../Inventoryutils/inventoryHelpers';
import './InventoryAIInsights.css';

interface AIAnalyzerProps {
  products: Product[];
  onClose: () => void;
}

interface AIInsight {
  type: 'warning' | 'success' | 'info' | 'prediction';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

const AIAnalyzer = ({ products, onClose }: AIAnalyzerProps) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    avgStockLevel: 0,
    riskScore: 0,
    efficiencyScore: 0
  });

  useEffect(() => {
    analyzeInventory();
  }, [products]);

  const analyzeInventory = () => {
    setTimeout(() => {
      const generatedInsights: AIInsight[] = [];

      // 1. Expiry Analysis
      const expiringProducts = products.filter(p => {
        const expiryDate = new Date(p.manufactureDate);
        expiryDate.setDate(expiryDate.getDate() + p.expiryDays);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      });

      if (expiringProducts.length > 0) {
        generatedInsights.push({
          type: 'warning',
          title: `${expiringProducts.length} Products Expiring Soon`,
          description: `${expiringProducts.map(p => p.name).join(', ')} will expire within 7 days. Consider promotional pricing or redistribution.`,
          priority: 'high',
          action: 'Review expiring products immediately'
        });
      }

      // 2. Low Stock Analysis
      const lowStockProducts = products.filter(p => p.status === 'low-stock');
      if (lowStockProducts.length > 0) {
        const totalLowStockValue = lowStockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        generatedInsights.push({
          type: 'warning',
          title: `${lowStockProducts.length} Products Below Minimum Stock`,
          description: `Low stock items worth ${formatCurrency(totalLowStockValue)}. Reorder: ${lowStockProducts.map(p => p.name).slice(0, 3).join(', ')}${lowStockProducts.length > 3 ? '...' : ''}`,
          priority: 'high',
          action: 'Place reorder for low stock items'
        });
      }

      // 3. Stock Value Analysis
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const highValueProducts = products
        .map(p => ({ ...p, value: p.price * p.stock }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);

      generatedInsights.push({
        type: 'info',
        title: 'High-Value Products Identified',
        description: `Your top 3 valuable items are: ${highValueProducts.map(p => `${p.name} (${formatCurrency(p.value)})`).join(', ')}. These require extra monitoring.`,
        priority: 'medium',
        action: 'Ensure security measures for high-value items'
      });

      // 4. Turnover Prediction
      const activeProducts = products.filter(p => p.status === 'active');
      if (activeProducts.length > 0) {
        generatedInsights.push({
          type: 'prediction',
          title: 'Stock Turnover Prediction',
          description: `Based on current inventory levels, estimated ${Math.ceil(activeProducts.length * 0.3)} products will need restocking within 14 days.`,
          priority: 'medium',
          action: 'Plan procurement for next 2 weeks'
        });
      }

      // 5. Category Analysis
      const categoryStats = products.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { count: 0, value: 0 };
        }
        acc[p.category].count++;
        acc[p.category].value += p.price * p.stock;
        return acc;
      }, {} as Record<string, { count: number; value: number }>);

      const topCategory = Object.entries(categoryStats)
        .sort((a, b) => b[1].value - a[1].value)[0];

      if (topCategory) {
        generatedInsights.push({
          type: 'success',
          title: 'Top Performing Category',
          description: `"${topCategory[0]}" category represents ${formatCurrency(topCategory[1].value)} in inventory value with ${topCategory[1].count} products.`,
          priority: 'low',
          action: 'Continue focusing on this category'
        });
      }

      // 6. Efficiency Score
      const outOfStock = products.filter(p => p.status === 'out-of-stock').length;
      const expired = products.filter(p => p.status === 'expired').length;
      const efficiencyScore = Math.round(((products.length - outOfStock - expired) / products.length) * 100);

      if (efficiencyScore < 80) {
        generatedInsights.push({
          type: 'warning',
          title: 'Inventory Efficiency Below Target',
          description: `Current efficiency score is ${efficiencyScore}%. ${outOfStock} out of stock and ${expired} expired items detected. Optimize inventory management.`,
          priority: 'high',
          action: 'Review inventory management processes'
        });
      } else {
        generatedInsights.push({
          type: 'success',
          title: 'Excellent Inventory Efficiency',
          description: `Your inventory efficiency is ${efficiencyScore}%! Well-managed stock levels with minimal waste.`,
          priority: 'low',
          action: 'Maintain current practices'
        });
      }

      // 7. Seasonal Recommendations
      const currentMonth = new Date().getMonth();
      if ([11, 0, 1].includes(currentMonth)) { // Dec, Jan, Feb
        generatedInsights.push({
          type: 'prediction',
          title: 'Seasonal Demand Forecast',
          description: 'Winter season typically sees 20-30% increase in dairy product demand. Consider increasing stock levels for popular items.',
          priority: 'medium',
          action: 'Review and adjust stock levels'
        });
      }

      // 8. Price Optimization
      const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
      const undervaluedProducts = products.filter(p => p.price < avgPrice * 0.7);
      
      if (undervaluedProducts.length > 0) {
        generatedInsights.push({
          type: 'info',
          title: 'Price Optimization Opportunity',
          description: `${undervaluedProducts.length} products are priced significantly below average. Consider reviewing pricing strategy for: ${undervaluedProducts.slice(0, 2).map(p => p.name).join(', ')}`,
          priority: 'low',
          action: 'Analyze pricing strategy'
        });
      }

      // Calculate statistics
      const avgStockLevel = Math.round(products.reduce((sum, p) => sum + p.stock, 0) / products.length);
      const riskScore = Math.round((expiringProducts.length * 10 + lowStockProducts.length * 8 + expired * 12) / 3);

      setInsights(generatedInsights);
      setStats({
        totalValue,
        avgStockLevel,
        riskScore: Math.min(riskScore, 100),
        efficiencyScore
      });
      setAnalyzing(false);
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle />;
      case 'success':
        return <FaCheckCircle />;
      case 'prediction':
        return <FaChartLine />;
      default:
        return <FaLightbulb />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="ai-analyzer-overlay">
      <motion.div
        className="ai-analyzer-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="analyzer-header">
          <div className="header-left">
            <FaBrain className="brain-icon" />
            <div>
              <h2>Licious AI</h2>
              <p>Intelligent insights powered by advanced analytics</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {analyzing ? (
          <div className="analyzing-container">
            <motion.div
              className="analyzing-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <FaBrain />
            </motion.div>
            <h3>Analyzing Your Inventory...</h3>
            <div className="analyzing-steps">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ✓ Scanning {products.length} products
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                ✓ Analyzing stock levels and trends
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                ✓ Generating intelligent recommendations
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                ✓ Calculating risk and efficiency scores
              </motion.p>
            </div>
          </div>
        ) : (
          <>
            <div className="stats-dashboard">
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FaBox className="stat-icon" style={{ color: '#3b82f6' }} />
                <div className="stat-content">
                  <p className="stat-label">Total Inventory Value</p>
                  <h3 className="stat-value">{formatCurrency(stats.totalValue)}</h3>
                </div>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FaArrowUp className="stat-icon" style={{ color: '#10b981' }} />
                <div className="stat-content">
                  <p className="stat-label">Avg Stock Level</p>
                  <h3 className="stat-value">{stats.avgStockLevel} units</h3>
                </div>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FaExclamationTriangle 
                  className="stat-icon" 
                  style={{ color: stats.riskScore > 50 ? '#ef4444' : '#f59e0b' }} 
                />
                <div className="stat-content">
                  <p className="stat-label">Risk Score</p>
                  <h3 className="stat-value">{stats.riskScore}/100</h3>
                </div>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FaCheckCircle className="stat-icon" style={{ color: '#10b981' }} />
                <div className="stat-content">
                  <p className="stat-label">Efficiency Score</p>
                  <h3 className="stat-value">{stats.efficiencyScore}%</h3>
                </div>
              </motion.div>
            </div>

            <div className="insights-container">
              <h3>
                <FaLightbulb /> AI-Powered Insights ({insights.length})
              </h3>
              
              <div className="insights-list">
                <AnimatePresence>
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      className={`insight-card insight-${insight.type}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ borderLeftColor: getPriorityColor(insight.priority) }}
                    >
                      <div className="insight-header">
                        <div className="insight-icon">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="insight-title-section">
                          <h4>{insight.title}</h4>
                          <span 
                            className="priority-badge"
                            style={{ background: getPriorityColor(insight.priority) }}
                          >
                            {insight.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="insight-description">{insight.description}</p>
                      {insight.action && (
                        <div className="insight-action">
                          <FaClock /> <strong>Action:</strong> {insight.action}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="analyzer-footer">
              <p>
                <FaBrain /> Analysis completed • Last updated: {formatDate(new Date().toISOString())}
              </p>
              <button className="btn-reanalyze" onClick={() => { setAnalyzing(true); analyzeInventory(); }}>
                Re-analyze
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AIAnalyzer;
