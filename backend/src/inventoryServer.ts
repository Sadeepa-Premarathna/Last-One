import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';
import rawMilkRoutes from './routes/rawMilkRoutes';

import { errorHandler } from './middleware/errorHandler';
import cron from 'node-cron';
import Product from './models/Product';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for image uploads

// Connect to Database
connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
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

app.use('/api/products', productRoutes);
app.use('/api/rawmilk', rawMilkRoutes);

// Error Handler
app.use(errorHandler);

// Cron job to check for expired products daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    await Product.updateMany(
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

export default app;
