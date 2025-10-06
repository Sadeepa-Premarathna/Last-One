const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const userRoutes = require('./Routes/userRoutes');
const chatbotRoutes = require('./Routes/chatbotRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with better error handling
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy-shop',
    touchAfter: 24 * 3600, // lazy session update
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Database connection with fallback
const connectDB = async () => {
  try {
    // First try MongoDB Atlas
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy-shop',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    // Fallback to local MongoDB for development
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('🔄 Attempting to connect to local MongoDB...');
        const localConn = await mongoose.connect('mongodb://localhost:27017/dairy-shop', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
        console.log('💡 Note: Using local MongoDB. Install MongoDB locally or fix Atlas connection.');
      } catch (localError) {
        console.error('❌ Local MongoDB connection also failed:', localError.message);
        console.log('💡 To fix this:');
        console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
        console.log('   2. Or fix your MongoDB Atlas connection string in .env file');
        console.log('   3. Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DairyLicious API is running!',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DairyLicious API!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      chatbot: '/api/chatbot',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
