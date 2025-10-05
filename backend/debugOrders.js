const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function debugOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    // Check using raw MongoDB driver
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');
    const rawOrders = await ordersCollection.find({}).toArray();
    console.log('\n🔍 Raw orders from MongoDB (first order):');
    console.log(JSON.stringify(rawOrders[0], null, 2));

    // Now check using Mongoose model
    const Order = require('./models/Order');
    const modelOrders = await Order.find({});
    console.log('\n📦 Orders from Mongoose Model:');
    console.log(`Count: ${modelOrders.length}`);
    if (modelOrders.length > 0) {
      console.log('First order:', JSON.stringify(modelOrders[0], null, 2));
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

debugOrders();
