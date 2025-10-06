import express from 'express';
import Employee from '../Model/EmployeeModel.js';

const router = express.Router();

// Test endpoint to check database connectivity
router.get('/test', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const sampleEmployee = await Employee.findOne().limit(1);
    
    res.json({
      success: true,
      message: 'Database connection working!',
      data: {
        totalEmployees: count,
        sampleEmployee: sampleEmployee || 'No employees found'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Direct employee lookup test
router.get('/employee/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    console.log(`🔍 Test route looking for employee: ${employeeId}`);
    
    // Try direct find with lean and exec to avoid buffering
    const employee = await Employee.findOne({ employee_id: employeeId }).lean().exec();
    
    if (employee) {
      console.log(`✅ Test route found employee: ${employee.name}`);
      res.json({
        success: true,
        message: 'Employee found!',
        data: employee
      });
    } else {
      console.log(`❌ Test route: Employee ${employeeId} not found`);
      res.status(404).json({
        success: false,
        message: 'Employee not found',
        searchedId: employeeId
      });
    }
  } catch (error) {
    console.error('❌ Test route error finding employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding employee',
      error: error.message
    });
  }
});

// Enhanced health check endpoint with MongoDB status
router.get('/health', async (req, res) => {
  const mongoose = await import('mongoose');
  
  const connectionStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const connectionState = mongoose.default.connection.readyState;
  const isConnected = connectionState === 1;
  
  let dbPing = null;
  if (isConnected) {
    try {
      const adminDb = mongoose.default.connection.db.admin();
      const pingResult = await adminDb.ping();
      dbPing = pingResult.ok === 1 ? 'OK' : 'FAILED';
    } catch (error) {
      dbPing = `ERROR: ${error.message}`;
    }
  }
  
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    database: {
      name: 'dairy_shop',
      status: connectionStates[connectionState],
      connected: isConnected,
      ping: dbPing,
      host: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Not configured'
    },
    server: {
      port: process.env.PORT || 'default',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  });
});

export default router;