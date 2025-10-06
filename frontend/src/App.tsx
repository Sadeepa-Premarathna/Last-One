<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard.tsx';
import AIAnalyzerPage from './pages/AIAnalyzerPage';
import MobileProductForm from './pages/MobileProductForm';
import Shop from './pages/Shop';
import RawMaterial from './pages/RawMaterial';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mobile form route without layout */}
        <Route path="/add-product-mobile" element={<MobileProductForm />} />
        
        {/* Desktop routes with layout */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/raw-material" element={<RawMaterial />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/ai-analyzer" element={<AIAnalyzerPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
=======
import { useState, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import DriverList from './components/Driver/DriverList';
import DriverForm from './components/Driver/DriverForm';
import FarmerList from './components/Farmer/FarmerList';
import FarmerForm from './components/Farmer/FarmerForm';
import DeliveryList from './components/Delivery/DeliveryList';
import DeliveryForm from './components/Delivery/DeliveryForm';
import MilkCollectionList from './components/MilkCollection/MilkCollectionList';
import MilkCollectionForm from './components/MilkCollection/MilkCollectionForm';
import OrderList from './components/Order/OrderList';
import PaymentList from './components/Payment/PaymentList';
import { 
  FaTruck, 
  FaUsers, 
  FaBoxOpen, 
  FaWineBottle, 
  FaHome, 
  FaBars, 
  FaTimes,
  FaChartLine,
  FaCog,
  FaShoppingCart,
  FaMoneyBillWave
} from 'react-icons/fa';

function AppContent(): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const location = useLocation();

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="top-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="brand">
            <span className="brand-icon">🥛</span>
            <div className="brand-text">
              <h1>Daily Licious</h1>
              <p>Dairy Management System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <div className="user-avatar">A</div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
          >
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>

          <div className="nav-section">
            <span className="nav-section-title">Management</span>
          </div>

          <Link 
            to="/drivers" 
            className={`nav-item ${isActive('/drivers') ? 'active' : ''}`}
          >
            <FaTruck className="nav-icon" />
            <span className="nav-text">Drivers</span>
          </Link>

          <Link 
            to="/farmers" 
            className={`nav-item ${isActive('/farmers') ? 'active' : ''}`}
          >
            <FaUsers className="nav-icon" />
            <span className="nav-text">Farmers</span>
          </Link>

          <Link 
            to="/deliveries" 
            className={`nav-item ${isActive('/deliveries') ? 'active' : ''}`}
          >
            <FaBoxOpen className="nav-icon" />
            <span className="nav-text">Deliveries</span>
          </Link>

          <Link 
            to="/milk-collections" 
            className={`nav-item ${isActive('/milk-collections') ? 'active' : ''}`}
          >
            <FaWineBottle className="nav-icon" />
            <span className="nav-text">Milk Collections</span>
          </Link>

          <Link 
            to="/orders" 
            className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
          >
            <FaShoppingCart className="nav-icon" />
            <span className="nav-text">Orders</span>
          </Link>

          <Link 
            to="/payments" 
            className={`nav-item ${isActive('/payments') ? 'active' : ''}`}
          >
            <FaMoneyBillWave className="nav-icon" />
            <span className="nav-text">Payments</span>
          </Link>

          <div className="nav-section">
            <span className="nav-section-title">Analytics</span>
          </div>

          <Link to="/reports" className="nav-item">
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Reports</span>
          </Link>

          <div className="nav-section">
            <span className="nav-section-title">System</span>
          </div>

          <Link to="/settings" className="nav-item">
            <FaCog className="nav-icon" />
            <span className="nav-text">Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <p>&copy; 2024 Daily Licious</p>
          <p className="version">v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Driver Routes */}
            <Route path="/drivers" element={<DriverList />} />
            <Route path="/drivers/add" element={<DriverForm />} />
            <Route path="/drivers/edit/:id" element={<DriverForm />} />
            
            {/* Farmer Routes */}
            <Route path="/farmers" element={<FarmerList />} />
            <Route path="/farmers/add" element={<FarmerForm />} />
            <Route path="/farmers/edit/:id" element={<FarmerForm />} />
            
            {/* Delivery Routes */}
            <Route path="/deliveries" element={<DeliveryList />} />
            <Route path="/deliveries/add" element={<DeliveryForm />} />
            <Route path="/deliveries/edit/:id" element={<DeliveryForm />} />
            
            {/* Milk Collection Routes */}
            <Route path="/milk-collections" element={<MilkCollectionList />} />
            <Route path="/milk-collections/add" element={<MilkCollectionForm />} />
            <Route path="/milk-collections/edit/:id" element={<MilkCollectionForm />} />
            
            {/* Order Routes */}
            <Route path="/orders" element={<OrderList />} />
            
            {/* Payment Routes */}
            <Route path="/payments" element={<PaymentList />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App(): ReactElement {
  return (
    <Router>
      <AppContent />
>>>>>>> origin/delivery
    </Router>
  );
}

export default App;
