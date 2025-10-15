import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './InventoryRawMaterial.css';

// Enhanced milk collection data with Sri Lankan farmers
const milkCollections = [
  {
    id: 1,
    farmerName: "Sunil Perera",
    farmerId: "FM001",
    collectionDate: "2025-10-07",
    collectionTime: "06:30 AM",
    quantity: 45.5,
    qualityGrade: "A",
    fatContent: 4.2,
    snfContent: 8.8,
    pricePerLiter: 95.00,
    totalAmount: 4322.50,
    status: "Approved",
    location: "Gampaha Dairy Farm",
    phone: "+94 77 123 4567",
    batchNumber: "BT001"
  },
  {
    id: 2,
    farmerName: "Nimal Jayasinghe",
    farmerId: "FM002",
    collectionDate: "2025-10-07",
    collectionTime: "07:15 AM",
    quantity: 38.2,
    qualityGrade: "A+",
    fatContent: 4.5,
    snfContent: 9.1,
    pricePerLiter: 105.00,
    totalAmount: 4011.00,
    status: "Approved",
    location: "Kandy Highland Farm",
    phone: "+94 77 234 5678",
    batchNumber: "BT002"
  },
  {
    id: 3,
    farmerName: "Kamala Wijeratne",
    farmerId: "FM003",
    collectionDate: "2025-10-07",
    collectionTime: "05:45 AM",
    quantity: 52.8,
    qualityGrade: "B",
    fatContent: 3.8,
    snfContent: 8.5,
    pricePerLiter: 82.00,
    totalAmount: 4329.60,
    status: "Pending",
    location: "Matara Coconut Farm",
    phone: "+94 77 345 6789",
    batchNumber: "BT003"
  },
  {
    id: 4,
    farmerName: "Chandrika Silva",
    farmerId: "FM004",
    collectionDate: "2025-10-07",
    collectionTime: "06:00 AM",
    quantity: 41.7,
    qualityGrade: "A",
    fatContent: 4.1,
    snfContent: 8.9,
    pricePerLiter: 92.00,
    totalAmount: 3836.40,
    status: "Approved",
    location: "Kurunegala Valley Farm",
    phone: "+94 77 456 7890",
    batchNumber: "BT004"
  },
  {
    id: 5,
    farmerName: "Ajith Fernando",
    farmerId: "FM005",
    collectionDate: "2025-10-07",
    collectionTime: "07:30 AM",
    quantity: 29.3,
    qualityGrade: "C",
    fatContent: 3.5,
    snfContent: 8.2,
    pricePerLiter: 75.00,
    totalAmount: 2197.50,
    status: "Rejected",
    location: "Anuradhapura Dairy",
    phone: "+94 77 567 8901",
    batchNumber: "BT005"
  },
  {
    id: 6,
    farmerName: "Priyani Mendis",
    farmerId: "FM006",
    collectionDate: "2025-10-07",
    collectionTime: "06:45 AM",
    quantity: 47.3,
    qualityGrade: "A+",
    fatContent: 4.6,
    snfContent: 9.2,
    pricePerLiter: 108.00,
    totalAmount: 5108.40,
    status: "Approved",
    location: "Negombo Coastal Farm",
    phone: "+94 77 678 9012",
    batchNumber: "BT006"
  }
];

const InventoryRawMaterial: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const totalQuantity = milkCollections.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = milkCollections.reduce((sum, item) => sum + item.totalAmount, 0);
  const approvedCount = milkCollections.filter(item => item.status === 'Approved').length;
  const pendingCount = milkCollections.filter(item => item.status === 'Pending').length;
  const rejectedCount = milkCollections.filter(item => item.status === 'Rejected').length;
  const averagePrice = totalAmount / totalQuantity;

  // Filter data based on status and search term
  const filteredData = milkCollections.filter(item => {
    const matchesFilter = selectedFilter === 'All' || item.status === selectedFilter;
    const matchesSearch = item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-default';
    }
  };

  const getQualityClass = (grade: string) => {
    switch (grade) {
      case 'A+': return 'quality-a-plus';
      case 'A': return 'quality-a';
      case 'B': return 'quality-b';
      case 'C': return 'quality-c';
      default: return 'quality-default';
    }
  };

  return (
    <div className="raw-material-container">
      {/* Header Section */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <h1>Raw Milk Collection</h1>
          
          </div>
          <div className="header-actions">
            <motion.button 
              className="action-btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➕ Add Collection 
            </motion.button>
            <motion.button 
              className="action-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📊 Generate Report
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          className="stat-card total"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{milkCollections.length}</div>
            <div className="stat-label">Total Collections</div>
            <div className="stat-sublabel">Today's Records</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card quantity"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        >
          <div className="stat-icon">🥛</div>
          <div className="stat-content">
            <div className="stat-value">{totalQuantity.toFixed(1)} L</div>
            <div className="stat-label">Total Quantity</div>
            <div className="stat-sublabel">Collected Today</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card revenue"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(totalAmount)}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-sublabel">Avg: {formatCurrency(averagePrice)}/L</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card approved"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
        >
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-label">Approved</div>
            <div className="stat-sublabel">{pendingCount} Pending, {rejectedCount} Rejected</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by farmer name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-container">
          <div className="filter-tabs">
            {['All', 'Approved', 'Pending', 'Rejected'].map((filter) => (
              <motion.button
                key={filter}
                className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
                {filter !== 'All' && (
                  <span className="filter-count">
                    {filter === 'Approved' ? approvedCount : 
                     filter === 'Pending' ? pendingCount : rejectedCount}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        className="table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="table-header">
          <h2>📋 Milk Collection Records</h2>
          <div className="table-info">
            <span>Showing {filteredData.length} of {milkCollections.length} records</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="milk-collection-table">
            <thead>
              <tr>
                <th>Farmer Details</th>
                <th>Collection Info</th>
                <th>Quantity & Quality</th>
                <th>Composition</th>
                <th>Financial</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((collection, index) => (
                <motion.tr 
                  key={collection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(74, 144, 226, 0.05)' }}
                >
                  <td>
                    <div className="farmer-details">
                      <div className="farmer-name">{collection.farmerName}</div>
                      <div className="farmer-meta">
                        <span className="farmer-id">ID: {collection.farmerId}</span>
                        <span className="farmer-phone">📞 {collection.phone}</span>
                      </div>
                      <div className="farm-location">📍 {collection.location}</div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="collection-info">
                      <div className="collection-date">📅 {collection.collectionDate}</div>
                      <div className="collection-time">⏰ {collection.collectionTime}</div>
                      <div className="batch-number">🏷️ {collection.batchNumber}</div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="quantity-quality">
                      <div className="quantity-value">{collection.quantity} L</div>
                      <span className={`quality-badge ${getQualityClass(collection.qualityGrade)}`}>
                        Grade {collection.qualityGrade}
                      </span>
                    </div>
                  </td>
                  
                  <td>
                    <div className="composition-info">
                      <div className="composition-item">
                        <span className="label">Fat:</span>
                        <span className="value">{collection.fatContent}%</span>
                      </div>
                      <div className="composition-item">
                        <span className="label">SNF:</span>
                        <span className="value">{collection.snfContent}%</span>
                      </div>
                    </div>
                  </td>
                  
                  <td>
                    <div className="financial-info">
                      <div className="price-per-liter">Rs. {collection.pricePerLiter.toFixed(2)}/L</div>
                      <div className="total-amount">{formatCurrency(collection.totalAmount)}</div>
                    </div>
                  </td>
                  
                  <td>
                    <span className={`status-badge ${getStatusClass(collection.status)}`}>
                      {collection.status}
                    </span>
                  </td>
                  
                  <td>
                    <div className="action-buttons">
                      <motion.button 
                        className="btn-action view"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Details"
                      >
                        👁️
                      </motion.button>
                      <motion.button 
                        className="btn-action edit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Record"
                      >
                        ✏️
                      </motion.button>
                      <motion.button 
                        className="btn-action delete"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete Record"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        className="summary-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="summary-cards">
          <div className="summary-card quality-distribution">
            <h3>📊 Quality Distribution</h3>
            <div className="quality-stats">
              <div className="quality-stat">
                <span className="quality-badge quality-a-plus">A+</span>
                <span className="count">2 collections</span>
                <span className="percentage">33%</span>
              </div>
              <div className="quality-stat">
                <span className="quality-badge quality-a">A</span>
                <span className="count">2 collections</span>
                <span className="percentage">33%</span>
              </div>
              <div className="quality-stat">
                <span className="quality-badge quality-b">B</span>
                <span className="count">1 collection</span>
                <span className="percentage">17%</span>
              </div>
              <div className="quality-stat">
                <span className="quality-badge quality-c">C</span>
                <span className="count">1 collection</span>
                <span className="percentage">17%</span>
              </div>
            </div>
          </div>

          <div className="summary-card collection-timeline">
            <h3>⏰ Collection Timeline</h3>
            <div className="timeline-stats">
              <div className="timeline-item">
                <span className="time">05:45 AM</span>
                <span className="detail">First Collection</span>
              </div>
              <div className="timeline-item">
                <span className="time">07:30 AM</span>
                <span className="detail">Last Collection</span>
              </div>
              <div className="timeline-item peak">
                <span className="time">06:00 - 07:00</span>
                <span className="detail">Peak Hours (4 collections)</span>
              </div>
            </div>
          </div>

          <div className="summary-card financial-summary">
            <h3>💰 Financial Overview</h3>
            <div className="financial-stats">
              <div className="financial-item">
                <span className="label">Highest Rate:</span>
                <span className="value">Rs. 108.00/L (A+ Grade)</span>
              </div>
              <div className="financial-item">
                <span className="label">Lowest Rate:</span>
                <span className="value">Rs. 75.00/L (C Grade)</span>
              </div>
              <div className="financial-item">
                <span className="label">Average Rate:</span>
                <span className="value">Rs. {averagePrice.toFixed(2)}/L</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryRawMaterial;
