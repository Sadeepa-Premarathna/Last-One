import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy_shop';

async function verifyStatusFieldRemoval() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    const db = mongoose.connection.db;
    const payrollsCollection = db.collection('payrolls');

    console.log('🔍 Verifying payrolls collection...');
    
    // Get total count of payroll documents
    const totalDocs = await payrollsCollection.countDocuments({});
    console.log(`📊 Total payroll documents: ${totalDocs}`);

    // Check for any documents with status field
    const docsWithStatus = await payrollsCollection.countDocuments({ status: { $exists: true } });
    console.log(`🔍 Documents with status field: ${docsWithStatus}`);

    // Get a sample document to show current structure
    const sampleDoc = await payrollsCollection.findOne({});
    if (sampleDoc) {
      console.log('📝 Sample document structure:');
      console.log('Fields:', Object.keys(sampleDoc));
      console.log('Sample record:');
      console.log({
        _id: sampleDoc._id,
        employeeId: sampleDoc.employeeId,
        employeeName: sampleDoc.employeeName,
        month: sampleDoc.month,
        basicSalary: sampleDoc.basicSalary,
        overtimeAmount: sampleDoc.overtimeAmount,
        noPayDeductionAmount: sampleDoc.noPayDeductionAmount,
        createdAt: sampleDoc.createdAt,
        updatedAt: sampleDoc.updatedAt,
        hasStatus: sampleDoc.hasOwnProperty('status')
      });
    }

    if (docsWithStatus === 0) {
      console.log('✅ SUCCESS: No payroll documents have the status field');
      console.log('🎉 Status field has been completely removed from the database!');
    } else {
      console.log('⚠️ WARNING: Some documents still have the status field');
    }

  } catch (error) {
    console.error('❌ Error verifying status field removal:', error);
    throw error;
  } finally {
    console.log('🔐 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the verification
console.log('🔍 Starting verification of status field removal...');
console.log('📅 Date:', new Date().toISOString());
console.log('🗄️ Database:', MONGODB_URI);
console.log('=====================================');

verifyStatusFieldRemoval()
  .then(() => {
    console.log('=====================================');
    console.log('✅ Verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('=====================================');
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  });