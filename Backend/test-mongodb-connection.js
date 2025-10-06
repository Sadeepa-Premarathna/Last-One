import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log(`📊 Database: ${process.env.MONGODB_DB}`);
    console.log(`🔗 URI: ${process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    await mongoose.connect(process.env.MONGODB_URI, { 
      dbName: process.env.MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test the connection by listing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Available collections: ${collections.map(c => c.name).join(', ')}`);
    
    // Check specifically for employees collection
    const hasEmployeesCollection = collections.some(c => c.name === 'employees');
    console.log(`👥 Employees collection exists: ${hasEmployeesCollection ? '✅ Yes' : '❌ No'}`);
    
    // Check employee count
    const employeeCollection = mongoose.connection.db.collection('employees');
    const employeeCount = await employeeCollection.countDocuments();
    console.log(`📊 Employee count: ${employeeCount}`);
    
    if (employeeCount > 0) {
      // Get a sample employee to show structure
      const sampleEmployee = await employeeCollection.findOne();
      console.log('📄 Sample employee structure:');
      console.log(JSON.stringify(sampleEmployee, null, 2));
    }
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    return false;
  }
}

// Run the test
testMongoConnection().then(success => {
  process.exit(success ? 0 : 1);
});