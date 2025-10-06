const mongoose = require('mongoose');

async function checkCollections() {
  try {
    await mongoose.connect('mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/dairy_shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📚 Collections in database:');
    collections.forEach(coll => {
      console.log(`- ${coll.name}`);
    });

    // Check each collection's document count
    console.log('\n📊 Document counts:');
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCollections();
