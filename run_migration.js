// Auto-run Migration Script for Product Column Rename
// This script connects to MongoDB and runs the migration automatically

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'dairy_shop';
const COLLECTION_NAME = 'products';

async function runMigration() {
  console.log('\n🔄 Starting Database Migration...\n');
  
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in server/.env file');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Count products before migration
    const totalProducts = await collection.countDocuments();
    console.log(`📊 Found ${totalProducts} products to migrate\n`);
    
    if (totalProducts === 0) {
      console.log('⚠️  No products found. Migration skipped.');
      return;
    }

    // Step 1: Check if migration already done
    const alreadyMigrated = await collection.countDocuments({ 
      stock: { $exists: true },
      quantity: { $exists: false }
    });
    
    if (alreadyMigrated === totalProducts) {
      console.log('✅ Migration already completed! All products use new field names.');
      console.log('   - stock: ✓');
      console.log('   - expiryDays: ✓');
      console.log('   - image: ✓\n');
      await showSampleProduct(collection);
      return;
    }

    console.log('🔧 Step 1: Adding new fields with converted data...');
    
    // Step 1: Add new fields with converted data
    const result1 = await collection.updateMany(
      {},
      [
        {
          $set: {
            // Rename quantity to stock
            stock: { $ifNull: ["$quantity", 0] },
            
            // Calculate expiryDays from expiryDate and manufactureDate
            expiryDays: {
              $cond: {
                if: { $and: ["$expiryDate", "$manufactureDate"] },
                then: {
                  $ceil: {
                    $divide: [
                      { $subtract: ["$expiryDate", "$manufactureDate"] },
                      86400000  // milliseconds in a day
                    ]
                  }
                },
                else: 7  // default to 7 days if dates are missing
              }
            },
            
            // Rename imageUrl to image
            image: { $ifNull: ["$imageUrl", "/placeholder-product.jpg"] }
          }
        }
      ]
    );
    
    console.log(`   ✅ Modified ${result1.modifiedCount} products\n`);

    console.log('🗑️  Step 2: Removing old fields...');
    
    // Step 2: Remove old fields
    const result2 = await collection.updateMany(
      {},
      {
        $unset: {
          quantity: "",
          expiryDate: "",
          imageUrl: ""
        }
      }
    );
    
    console.log(`   ✅ Cleaned ${result2.modifiedCount} products\n`);

    // Step 3: Verify the migration
    console.log('🔍 Step 3: Verifying migration...\n');
    
    const verification = {
      total: await collection.countDocuments(),
      withStock: await collection.countDocuments({ stock: { $exists: true } }),
      withExpiryDays: await collection.countDocuments({ expiryDays: { $exists: true } }),
      withImage: await collection.countDocuments({ image: { $exists: true } }),
      withQuantity: await collection.countDocuments({ quantity: { $exists: true } }),
      withExpiryDate: await collection.countDocuments({ expiryDate: { $exists: true } }),
      withImageUrl: await collection.countDocuments({ imageUrl: { $exists: true } })
    };

    console.log('📊 Verification Results:');
    console.log('─────────────────────────────────────');
    console.log(`Total products:          ${verification.total}`);
    console.log(`\n✅ NEW FIELDS:`);
    console.log(`   Products with 'stock':      ${verification.withStock}/${verification.total}`);
    console.log(`   Products with 'expiryDays': ${verification.withExpiryDays}/${verification.total}`);
    console.log(`   Products with 'image':      ${verification.withImage}/${verification.total}`);
    console.log(`\n❌ OLD FIELDS (should be 0):`);
    console.log(`   Products with 'quantity':   ${verification.withQuantity}`);
    console.log(`   Products with 'expiryDate': ${verification.withExpiryDate}`);
    console.log(`   Products with 'imageUrl':   ${verification.withImageUrl}`);
    console.log('─────────────────────────────────────\n');

    if (verification.withQuantity === 0 && 
        verification.withExpiryDate === 0 && 
        verification.withImageUrl === 0 &&
        verification.withStock === verification.total &&
        verification.withExpiryDays === verification.total &&
        verification.withImage === verification.total) {
      console.log('✅ MIGRATION SUCCESSFUL! 🎉\n');
      await showSampleProduct(collection);
    } else {
      console.log('⚠️  WARNING: Migration may be incomplete. Please review the counts above.\n');
    }

  } catch (error) {
    console.error('\n❌ Migration Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

async function showSampleProduct(collection) {
  console.log('📄 Sample Migrated Product:');
  console.log('─────────────────────────────────────');
  const sample = await collection.findOne({}, {
    projection: {
      name: 1,
      stock: 1,
      expiryDays: 1,
      image: 1,
      manufactureDate: 1,
      price: 1
    }
  });
  if (sample) {
    console.log(JSON.stringify(sample, null, 2));
  }
  console.log('─────────────────────────────────────\n');
}

// Run the migration
runMigration()
  .then(() => {
    console.log('✅ Migration script completed successfully!');
    console.log('🚀 You can now start your application:\n');
    console.log('   Terminal 1: cd backend && npm run dev');
    console.log('   Terminal 2: cd frontend && npm run dev\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
