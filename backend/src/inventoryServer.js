const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/inventoryDatabase');
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryRawMilkRoutes = require('./routes/inventoryRawMilkRoutes');
const { errorHandler } = require('./middleware/inventoryErrorHandler');
const cron = require('node-cron');
const InventoryProduct = require('./models/InventoryProduct');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for image uploads

// Connect to Database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🥛 Welcome to Dairy Licious Inventory API',
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

// Cron job to check for expired products daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    await InventoryProduct.updateMany(
      { expiryDate: { $lt: now }, status: { $ne: 'expired' } },
      { status: 'expired' }
    );
    console.log('✅ Expired products updated');
  } catch (error) {
    console.error('❌ Error updating expired products:', error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;