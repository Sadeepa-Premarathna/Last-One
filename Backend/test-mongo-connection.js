import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

console.log('🔄 Testing MongoDB connection...');
console.log(`📊 Database: ${MONGODB_DB}`);
console.log(`🔗 URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

try {
  await mongoose.connect(MONGODB_URI, { 
    dbName: MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    retryWrites: true,
    family: 4
  });
  
  console.log('✅ MongoDB connected successfully!');
  
  // Test the connection by listing collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`📋 Available collections: ${collections.map(c => c.name).join(', ')}`);
  
  // Check employee count
  const employeeCollection = mongoose.connection.db.collection('employees');
  const employees = await employeeCollection.find({}).toArray();
  console.log(`👥 Employee count: ${employees.length}`);
  
  if (employees.length > 0) {
    console.log('📄 Sample employee:');
    console.log(JSON.stringify(employees[0], null, 2));
  }
  
  await mongoose.disconnect();
  console.log('✅ Test completed successfully!');
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}

process.exit(0);