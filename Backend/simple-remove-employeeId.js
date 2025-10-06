// Simple script to remove employeeId field from all payroll documents
import mongoose from 'mongoose';

// Direct connection - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://sadeepapremarathna:5raDNu5GE3JeySGg@cluster0.82iazhd.mongodb.net/dairy_shop?retryWrites=true&w=majority';

async function removeEmployeeIdField() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('payrolls');
    
    console.log('🔍 Checking current documents...');
    const sampleDoc = await collection.findOne({});
    if (sampleDoc) {
      console.log('📋 Sample document fields:', Object.keys(sampleDoc));
      console.log('   Has employeeId:', 'employeeId' in sampleDoc);
      console.log('   Has employeeIdDisplay:', 'employeeIdDisplay' in sampleDoc);
      console.log('   Sample employeeIdDisplay value:', sampleDoc.employeeIdDisplay);
    }
    
    console.log('🔄 Removing employeeId field from all payroll documents...');
    const result = await collection.updateMany(
      {}, // Match all documents
      { $unset: { employeeId: "" } } // Remove employeeId field
    );
    
    console.log(`✅ Successfully processed ${result.matchedCount} documents`);
    console.log(`✅ Modified ${result.modifiedCount} documents`);
    
    // Verify removal
    console.log('🔍 Verification...');
    const verifyDoc = await collection.findOne({});
    if (verifyDoc) {
      console.log('📋 Document fields after removal:', Object.keys(verifyDoc));
      console.log('   Has employeeId:', 'employeeId' in verifyDoc);
      console.log('   Has employeeIdDisplay:', 'employeeIdDisplay' in verifyDoc);
    }
    
    const stillHaveEmployeeId = await collection.countDocuments({ employeeId: { $exists: true } });
    console.log(`📊 Documents still with employeeId field: ${stillHaveEmployeeId}`);
    
    if (stillHaveEmployeeId === 0) {
      console.log('🎉 SUCCESS: employeeId field completely removed!');
    } else {
      console.log('⚠️  Some documents still have employeeId field');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

removeEmployeeIdField();