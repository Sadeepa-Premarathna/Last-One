const mongoose = require('mongoose');

async function checkOrders() {
  try {
    await mongoose.connect('mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/dairy_shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    const count = await ordersCollection.countDocuments();
    console.log(`📊 Total orders in collection: ${count}`);

    const orders = await ordersCollection.find({}).toArray();
    console.log('\n📦 Orders:');
    orders.forEach(order => {
      console.log(`- ${order.orderId}: ${order.customerName} - Status: ${order.status}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkOrders();
