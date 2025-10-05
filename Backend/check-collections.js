import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

async function checkCollections() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4
    });

    console.log(`✅ Connected to MongoDB database: ${MONGODB_DB}`);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Check leave-related collections
    const leaveCollections = collections.filter(c => c.name.toLowerCase().includes('leave'));
    console.log('\n🍃 Leave-related collections:');
    leaveCollections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Check the structure of leave applications
    if (leaveCollections.length > 0) {
      for (const collection of leaveCollections) {
        console.log(`\n📄 Sample document from ${collection.name}:`);
        const sampleDoc = await mongoose.connection.db.collection(collection.name).findOne();
        if (sampleDoc) {
          console.log(JSON.stringify(sampleDoc, null, 2));
        } else {
          console.log('   (empty collection)');
        }
      }
    }

    console.log('\n✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Database connection closed.');
  }
}

checkCollections();