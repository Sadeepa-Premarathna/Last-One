import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Force DNS to use Google's DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

console.log('🔧 Testing MongoDB connection...');
console.log(`🔧 Database: ${MONGODB_DB}`);
console.log(`🔧 URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

try {
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(MONGODB_URI, { 
        dbName: MONGODB_DB,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        retryWrites: true,
        family: 4 // Force IPv4
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test the employees collection
    const employeeCollection = mongoose.connection.db.collection('employees');
    const employees = await employeeCollection.find({}).toArray();
    
    console.log(`👥 Found ${employees.length} employees in MongoDB:`);
    employees.forEach((emp, index) => {
        console.log(`${index + 1}. ${emp.name} (${emp.employee_id}) - ${emp.role} in ${emp.department}`);
    });
    
    console.log('\n🎉 MongoDB connection test successful!');
    process.exit(0);
    
} catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
}