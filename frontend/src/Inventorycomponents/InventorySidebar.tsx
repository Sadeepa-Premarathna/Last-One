import { NavLink } from 'react-router-dom';
import { FaBox, FaChartLine, FaBrain, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './InventorySidebar.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { path: '/', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/raw-material', icon: <>🥛</>, label: 'Raw Material' },
    { path: '/shop', icon: <FaShoppingCart />, label: 'Shop' },
    { path: '/ai-analyzer', icon: <FaBrain />, label: 'Licious AI' }
  ];

  return (
    <>
      <motion.div
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <motion.div
            className="logo"
            animate={{ scale: isOpen ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <div className="logo-full">
                <div className="logo-icon-wrapper">
                  <img 
                    src="/dairy-licious-logo.png" 
                    alt="Dairy Licious" 
                    className="logo-image-main"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <span className="logo-fallback-icon" style={{ display: 'none' }}>🥛</span>
                </div>
                <div className="logo-text">
                  <h2>Dairy Licious</h2>
                  <p>Inventory System</p>
                </div>
              </div>
            ) : (
              <div className="logo-small">
                <div className="logo-icon-wrapper-small">
                  <img 
                    src="/dairy-licious-logo.png" 
                    alt="DL" 
                    className="logo-image-small"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <span className="logo-fallback-icon-small" style={{ display: 'none' }}>🥛</span>
                </div>
              </div>
            )}
          </motion.div>
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <motion.div
                className="nav-content"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.label}</span>}
              </motion.div>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="company-info"
            >
              <p>Sri Lanka's Premier</p>
              <p>Dairy Solutions</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
