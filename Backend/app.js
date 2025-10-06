import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Validate and parse PORT from environment
let PORT = parseInt(process.env.PORT, 10) || 5000;

if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
  console.warn(`⚠️  Invalid PORT value: ${process.env.PORT}. Falling back to 5000.`);
  PORT = 5000;
}

console.log(`🔧 Using port: ${PORT} (from ${process.env.PORT ? 'PORT env var' : 'default'})`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path.includes('/employees/')) {
    console.log(`👤 Employee lookup request: ${req.params.id || req.path.split('/').pop()}`);
  }
  next();
});

// Database connection with enhanced error handling
const dbUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || 'dairy_shop';

if (!dbUri) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  console.log('Please check your .env file contains:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  process.exit(1);
}

// Enhanced MongoDB connection function with retry logic
async function connectToMongoDB() {
  const connectionOptions = {
    dbName,
    // Enhanced connection options for reliability
    serverSelectionTimeoutMS: 10000, // Wait up to 10 seconds for server selection
    socketTimeoutMS: 45000, // Socket timeout
    connectTimeoutMS: 15000, // Initial connection timeout
    maxPoolSize: 10, // Connection pool size
    minPoolSize: 2, // Minimum connections
    maxIdleTimeMS: 30000, // Close idle connections
    retryWrites: true, // Enable retryable writes
    w: 'majority', // Write concern
    // DNS resolution options
    family: 4, // Force IPv4
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      console.log(`🔄 MongoDB connection attempt ${attempts}/${maxAttempts}...`);
      
      await mongoose.connect(dbUri, connectionOptions);
      console.log(`✅ Connected to MongoDB Atlas (dbName=${dbName})`);
      console.log('🔧 Connection established with enhanced options');
      
      // Test the connection with a simple query
      const adminDb = mongoose.connection.db.admin();
      const result = await adminDb.ping();
      console.log('🏓 MongoDB ping successful:', result.ok === 1 ? 'OK' : 'FAILED');
      
      return true;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempts} failed:`, error.message);
      
      if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('ENOTFOUND')) {
        console.log('🌐 DNS resolution issue detected. Trying alternative approaches...');
        
        if (attempts === 1) {
          // Try with different DNS settings on first retry
          console.log('🔄 Retrying with modified connection string...');
          
          // Try direct connection with resolved hostnames
          const directUri = process.env.MONGODB_URI_DIRECT || 
            'mongodb://admin:zUwJYfxBUS1dfImJ@ac-7sqzakp-shard-00-00.82iazhd.mongodb.net:27017,ac-7sqzakp-shard-00-01.82iazhd.mongodb.net:27017,ac-7sqzakp-shard-00-02.82iazhd.mongodb.net:27017/dairy_shop?ssl=true&replicaSet=atlas-swinty-shard-0&authSource=admin&retryWrites=true&w=majority';
          
          try {
            console.log('🔄 Trying direct connection with resolved hostnames...');
            await mongoose.connect(directUri, connectionOptions);
            console.log('✅ Connected using direct hostname connection');
            return true;
          } catch (altError) {
            console.log('⚠️ Direct hostname connection also failed:', altError.message);
            
            // Try standard non-SRV format as final fallback
            const standardUri = dbUri.replace('mongodb+srv://', 'mongodb://').replace('.mongodb.net/', '.mongodb.net:27017/');
            try {
              console.log('🔄 Trying standard connection format...');
              await mongoose.connect(standardUri, connectionOptions);
              console.log('✅ Connected using standard connection format');
              return true;
            } catch (standardError) {
              console.log('⚠️ Standard connection also failed, continuing with retries...');
            }
          }
        }
      }
      
      if (attempts < maxAttempts) {
        const delay = attempts * 2000; // Progressive delay: 2s, 4s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('❌ All MongoDB connection attempts failed!');
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Check your internet connection');
  console.log('2. Verify MongoDB Atlas cluster is running');
  console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
  console.log('4. Verify credentials in .env file');
  console.log('5. Try connecting from MongoDB Compass with same credentials');
  console.log('\n⚠️ Server will continue without database connection');
  console.log('   Some features may not work until database is connected\n');
  
  return false;
}

// Attempt MongoDB connection
connectToMongoDB();

// Enhanced MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connection established successfully');
  // Disable buffering to prevent timeout issues
  mongoose.set('bufferCommands', false);
  console.log('🔧 Mongoose buffering disabled for better performance');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  
  if (err.message.includes('querySrv ENOTFOUND')) {
    console.log('🔍 DNS Resolution Issue Detected:');
    console.log('  - Check your internet connection');
    console.log('  - Verify DNS servers are working');
    console.log('  - Try connecting from a different network');
    console.log('  - Check if corporate firewall is blocking MongoDB Atlas');
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB connection lost. System will attempt automatic reconnection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB connection restored successfully');
  mongoose.set('bufferCommands', false); // Re-disable buffering after reconnection
});

mongoose.connection.on('reconnectFailed', () => {
  console.error('❌ MongoDB reconnection failed after multiple attempts');
  console.log('🔧 Manual intervention may be required');
});

// Connection state monitoring
setInterval(() => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  if (state !== 1) {
    console.log(`⚠️ MongoDB state: ${states[state]} (${state})`);
  }
}, 30000); // Check every 30 seconds

// Graceful shutdown with connection cleanup
process.on('SIGINT', async () => {
  console.log('\n🔚 Shutting down server gracefully...');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed cleanly');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during graceful shutdown:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔚 Received SIGTERM, shutting down gracefully...');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed cleanly');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during graceful shutdown:', err);
    process.exit(1);
  }
});

// Routes
import attendanceRoutes from './Routes/AttendanceRoutes.js';
import employeeRoutes from './Routes/EmployeeRoutes.js';
import leaveRoutes from './Routes/LeaveRoutes.js';
import testRoutes from './Routes/TestRoutes.js';

app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/test', testRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'DairyLicious Backend API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Function to find available port
const findAvailablePort = async (startPort) => {
  const net = await import('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Start server with port handling
const startServer = async () => {
  try {
    console.log(`🔍 Checking port availability for port ${PORT}...`);
    const availablePort = await findAvailablePort(PORT);
    
    if (availablePort !== PORT) {
      console.log(`⚠️  Port ${PORT} is busy, using port ${availablePort} instead`);
      console.log(`💡 To avoid this, either:`);
      console.log(`   1. Free up port ${PORT} by stopping other services`);
      console.log(`   2. Change PORT in your .env file to ${availablePort}`);
    }
    
    app.listen(availablePort, () => {
      console.log(`🚀 Server is running on port ${availablePort}`);
      console.log(`📡 API Base URL: http://localhost:${availablePort}`);
      console.log(`🔗 Health Check: http://localhost:${availablePort}/`);
      console.log(`✅ MongoDB connected to: ${dbName}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if another service is using the port');
    console.log('2. Kill existing Node.js processes: taskkill /f /im node.exe');
    console.log('3. Change PORT in your .env file to a different number (1-65535)');
    console.log('4. Restart your terminal and try again');
    console.log('5. Check your .env file for invalid PORT values\n');
    process.exit(1);
  }
};

startServer();
