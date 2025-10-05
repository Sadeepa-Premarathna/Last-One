import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaDollarSign, 
  FaFileAlt, 
  FaBrain,
  FaChartLine,
  FaWarehouse
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DashboardStats, Product } from '../types';
import { productService } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import ProductReport from '../components/ProductReport';
import AIAnalyzer from '../components/AIAnalyzer';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);
  const [reportProducts, setReportProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, productsData] = await Promise.all([
        productService.getDashboardStats(),
        productService.getAllProducts()
      ]);
      setStats(statsData);
      setProducts(productsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const statusData = [
    { name: 'Active', value: stats?.activeProducts || 0, color: '#10b981' },
    { name: 'Low Stock', value: stats?.lowStockProducts || 0, color: '#f59e0b' },
    { name: 'Expired', value: stats?.expiredProducts || 0, color: '#ef4444' }
  ];

  // Category distribution
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
      existing.totalValue += product.price * product.stock;
    } else {
      acc.push({
        name: product.category,
        value: 1,
        totalValue: product.price * product.stock
      });
    }
    return acc;
  }, []);

  // Top products by value
  const topProducts = products
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      value: p.price * p.stock,
      stock: p.stock
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Monthly trend simulation (you can replace with actual data)
  const monthlyTrend = [
    { month: 'Jan', products: 45, value: 12500 },
    { month: 'Feb', products: 52, value: 15200 },
    { month: 'Mar', products: 48, value: 14100 },
    { month: 'Apr', products: 61, value: 18300 },
    { month: 'May', products: 58, value: 17800 },
    { month: 'Jun', products: stats?.totalProducts || 65, value: stats?.totalInventoryValue || 19500 }
  ];

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <FaBox />,
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      trend: '+12%'
    },
    {
      title: 'Total Inventory Value',
      value: formatCurrency(stats?.totalInventoryValue || 0),
      icon: <FaDollarSign />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      trend: '+8.5%'
    },
    {
      title: 'Active Products',
      value: stats?.activeProducts || 0,
      icon: <FaCheckCircle />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      trend: '+5%'
    },
    {
      title: 'Alerts',
      value: (stats?.lowStockProducts || 0) + (stats?.expiredProducts || 0),
      icon: <FaExclamationTriangle />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      trend: '-3%'
    }
  ];



  return (
    <div className="dashboard-page">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-title">
          <h1>🥛 Dairy Licious Dashboard</h1>
          <p>Welcome to your inventory management system</p>
        </div>
        
        {/* Quick Actions at Top */}
        <div className="header-quick-actions">
          <motion.button
            className="quick-action-btn products"
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBox />
            <span>Products</span>
          </motion.button>

          <motion.button
            className="quick-action-btn report"
            onClick={async () => {
              const products = await productService.getAllProducts();
              setReportProducts(products);
              setShowReport(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileAlt />
            <span>Report</span>
          </motion.button>

          <motion.button
            className="quick-action-btn ai"
            onClick={async () => {
              const products = await productService.getAllProducts();
              setAllProducts(products);
              setShowAIAnalyzer(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBrain />
            <span>Licious AI</span>
          </motion.button>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <motion.div
            className="stats-grid-new"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="stat-card-new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
              >
                <div className="stat-icon-new" style={{ backgroundColor: card.bgColor, color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-content-new">
                  <p className="stat-title-new">{card.title}</p>
                  <h2 className="stat-value-new">{card.value}</h2>
                  <div className="stat-trend">
                    <FaChartLine style={{ color: card.trend.startsWith('+') ? '#10b981' : '#ef4444' }} />
                    <span style={{ color: card.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                      {card.trend} from last month
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Product Status Distribution */}
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="chart-header">
                <h3>Product Status Distribution</h3>
                <p>Current inventory status breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Products by Value */}
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="chart-header">
                <h3>Top Products by Value</h3>
                <p>Highest value items in inventory</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis type="category" dataKey="name" width={120} stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#667eea" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="chart-header">
                <h3>Category Distribution</h3>
                <p>Products by category</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Product Count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Trend */}
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="chart-header">
                <h3>Inventory Trend</h3>
                <p>6-month inventory overview</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="products"
                    stroke="#667eea"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Total Products"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div
            className="inventory-value-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <div className="value-icon">
              <FaDollarSign />
            </div>
            <div className="value-info">
              <h3>Total Inventory Value</h3>
              <motion.p
                className="value-amount"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
              >
                {formatCurrency(stats?.totalInventoryValue || 0)}
              </motion.p>
            </div>
          </motion.div>

          {/* Alert Cards */}
          {(stats && (stats.lowStockProducts > 0 || stats.expiredProducts > 0)) && (
            <div className="alerts-section">
              {stats.lowStockProducts > 0 && (
                <motion.div
                  className="alert-card warning"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => navigate('/products')}
                >
                  <FaExclamationTriangle className="alert-icon" />
                  <div className="alert-content">
                    <h3>Low Stock Alert</h3>
                    <p>{stats.lowStockProducts} items need restocking</p>
                  </div>
                </motion.div>
              )}

              {stats.expiredProducts > 0 && (
                <motion.div
                  className="alert-card danger"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  onClick={() => navigate('/products')}
                >
                  <FaTimesCircle className="alert-icon" />
                  <div className="alert-content">
                    <h3>Expired Products</h3>
                    <p>{stats.expiredProducts} items have expired</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <motion.div
            className="company-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
          >
            <div className="banner-content">
              <h2>🇱🇰 Dairy Licious</h2>
              <p>Sri Lanka's Premier Dairy Products Manufacturer</p>
              <div className="banner-features">
                <span>✓ Quality Assured</span>
                <span>✓ Fresh Daily</span>
                <span>✓ Island-wide Delivery</span>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {showReport && (
        <ProductReport
          products={reportProducts}
          onClose={() => setShowReport(false)}
        />
      )}

      {showAIAnalyzer && (
        <AIAnalyzer
          products={allProducts}
          onClose={() => setShowAIAnalyzer(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
