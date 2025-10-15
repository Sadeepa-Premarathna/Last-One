import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDeliverySchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Get one delivery to see the structure
    const delivery = await db.collection('deliveries').findOne();
    console.log('📦 Sample Delivery Document:');
    console.log(JSON.stringify(delivery, null, 2));
    
    // Check indexes
    const indexes = await db.collection('deliveries').indexes();
    console.log('\n📊 Delivery Collection Indexes:');
    console.log(JSON.stringify(indexes, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkDeliverySchema();
