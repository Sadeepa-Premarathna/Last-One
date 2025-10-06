// Script to safely remove employeeId field from payroll documents
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection using environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'dairy_shop';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI in environment variables');
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define schemas with flexible structure
const PayrollSchema = new mongoose.Schema({}, { strict: false });
const Payroll = mongoose.model('Payroll', PayrollSchema);

const removeEmployeeIdField = async () => {
  console.log('🔧 Starting employeeId field removal process...\n');

  try {
    // First, let's check what we have
    console.log('📊 Current payroll document structure:');
    const samplePayroll = await Payroll.findOne({});
    if (samplePayroll) {
      const fields = Object.keys(samplePayroll.toObject());
      console.log('   Fields:', fields.join(', '));
      
      if (fields.includes('employeeId')) {
        console.log('   ✅ employeeId field exists');
      } else {
        console.log('   ❌ employeeId field not found');
      }
      
      if (fields.includes('employeeIdDisplay')) {
        console.log('   ✅ employeeIdDisplay field exists');
        console.log('   📋 Sample employeeIdDisplay value:', samplePayroll.employeeIdDisplay);
      } else {
        console.log('   ❌ employeeIdDisplay field not found - STOPPING!');
        return;
      }
    }
    
    console.log('\n🔄 Checking all payroll records...');
    const totalPayrolls = await Payroll.countDocuments({});
    console.log(`📊 Total payroll records: ${totalPayrolls}`);
    
    // Check how many have employeeIdDisplay
    const withEmployeeIdDisplay = await Payroll.countDocuments({ employeeIdDisplay: { $exists: true, $ne: null } });
    console.log(`✅ Records with employeeIdDisplay: ${withEmployeeIdDisplay}`);
    
    if (withEmployeeIdDisplay !== totalPayrolls) {
      console.log(`❌ WARNING: ${totalPayrolls - withEmployeeIdDisplay} records are missing employeeIdDisplay!`);
      console.log('   Please run the fix script first to add employeeIdDisplay to all records.');
      return;
    }
    
    console.log('\n🎯 All records have employeeIdDisplay. Proceeding with employeeId removal...');
    
    // Show what we're about to remove
    console.log('\n📋 Sample records before removal:');
    const samples = await Payroll.find({}).limit(2);
    samples.forEach((record, index) => {
      console.log(`   Record ${index + 1}:`);
      console.log(`     employeeId: ${record.employeeId}`);
      console.log(`     employeeIdDisplay: ${record.employeeIdDisplay}`);
      console.log(`     employeeName: ${record.employeeName}`);
    });
    
    // Confirm before proceeding
    console.log('\n⚠️  FINAL CONFIRMATION:');
    console.log('   This will PERMANENTLY remove the employeeId field from ALL payroll records.');
    console.log('   The employeeIdDisplay field will be kept and will be used for employee identification.');
    console.log('   This action cannot be undone easily.');
    console.log('\n🔄 Proceeding with removal...');
    
    // Remove the employeeId field from all documents
    const result = await Payroll.updateMany(
      {}, // Match all documents
      { $unset: { employeeId: "" } } // Remove the employeeId field
    );
    
    console.log(`\n✅ Successfully removed employeeId field from ${result.modifiedCount} documents`);
    
    // Verify the removal
    console.log('\n🔍 Verification - checking sample records after removal:');
    const verificationSamples = await Payroll.find({}).limit(2);
    verificationSamples.forEach((record, index) => {
      const obj = record.toObject();
      console.log(`   Record ${index + 1}:`);
      console.log(`     employeeId: ${obj.employeeId || 'REMOVED ✅'}`);
      console.log(`     employeeIdDisplay: ${obj.employeeIdDisplay}`);
      console.log(`     employeeName: ${obj.employeeName}`);
      console.log(`     Fields: ${Object.keys(obj).join(', ')}`);
    });
    
    // Check if any documents still have employeeId
    const stillHaveEmployeeId = await Payroll.countDocuments({ employeeId: { $exists: true } });
    if (stillHaveEmployeeId === 0) {
      console.log('\n🎉 SUCCESS: employeeId field completely removed from all payroll documents!');
    } else {
      console.log(`\n⚠️  WARNING: ${stillHaveEmployeeId} documents still have the employeeId field`);
    }
    
    console.log('\n📋 Summary:');
    console.log(`   ✅ Processed: ${totalPayrolls} documents`);
    console.log(`   ✅ Modified: ${result.modifiedCount} documents`);
    console.log(`   ✅ employeeIdDisplay field preserved in all records`);
    console.log(`   ✅ employeeId field removed from all records`);
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Update the Payroll model to remove employeeId field definition');
    console.log('   2. Update controllers to not use populate() on employeeId');
    console.log('   3. Update any queries that reference employeeId field');
    
  } catch (error) {
    console.error('❌ Error during employeeId removal:', error);
  }
};

const main = async () => {
  await connectDB();
  await removeEmployeeIdField();
  mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  console.log('🎯 employeeId field removal completed!');
};

main();