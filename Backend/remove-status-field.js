import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy_shop';

async function removeStatusField() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    console.log('🔍 Checking payrolls collection...');
    const db = mongoose.connection.db;
    const payrollsCollection = db.collection('payrolls');

    // Check current count of documents with status field
    const docsWithStatus = await payrollsCollection.countDocuments({ status: { $exists: true } });
    console.log(`📊 Found ${docsWithStatus} payroll documents with status field`);

    if (docsWithStatus === 0) {
      console.log('✅ No documents with status field found. Nothing to update.');
      return;
    }

    // Remove the status field from all documents
    console.log('🗑️ Removing status field from all payroll documents...');
    const result = await payrollsCollection.updateMany(
      { status: { $exists: true } },
      { $unset: { status: "" } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} documents`);
    console.log(`📋 Matched ${result.matchedCount} documents`);

    // Verify the removal
    const remainingDocsWithStatus = await payrollsCollection.countDocuments({ status: { $exists: true } });
    console.log(`🔍 Verification: ${remainingDocsWithStatus} documents still have status field`);

    if (remainingDocsWithStatus === 0) {
      console.log('🎉 Status field successfully removed from all payroll documents!');
    } else {
      console.log('⚠️ Some documents still have the status field. Please check manually.');
    }

  } catch (error) {
    console.error('❌ Error removing status field:', error);
    throw error;
  } finally {
    console.log('🔐 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the migration
console.log('🚀 Starting status field removal migration...');
console.log('📅 Date:', new Date().toISOString());
console.log('🗄️ Database:', MONGODB_URI);
console.log('📁 Collection: payrolls');
console.log('🎯 Action: Remove status field from all documents');
console.log('=====================================');

removeStatusField()
  .then(() => {
    console.log('=====================================');
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('=====================================');
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  });