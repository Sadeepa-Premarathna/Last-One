const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Inventoryconfig/inventoryDatabase');
const inventoryRoutes = require('./Inventoryroutes/inventoryRoutes');
const inventoryRawMilkRoutes = require('./Inventoryroutes/inventoryRawMilkRoutes');
const { errorHandler } = require('./Inventorymiddleware/inventoryErrorHandler');
const cron = require('node-cron');
const InventoryProduct = require('./Inventorymodels/InventoryProduct');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dairy Licious Inventory API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      stats: '/api/products/stats',
      expiring: '/api/products/expiring',
      lowStock: '/api/products/low-stock'
    }
  });
});

app.use('/api/products', inventoryRoutes);
app.use('/api/rawmilk', inventoryRawMilkRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Environment: ' + process.env.NODE_ENV);
});

module.exports = app;