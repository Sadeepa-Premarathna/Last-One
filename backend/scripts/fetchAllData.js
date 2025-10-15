import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully to Dairy Shop Database');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}\n`);
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const fetchAllData = async () => {
  const db = await connectDB();

  try {
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Available Collections:\n');

    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 Collection: ${collectionName}`);
      console.log(`📊 Total Documents: ${count}`);
      console.log(`${'='.repeat(60)}`);

      if (count > 0) {
        // Fetch sample documents (limit to 3 for readability)
        const sampleDocs = await db
          .collection(collectionName)
          .find({})
          .limit(3)
          .toArray();

        console.log('\n📄 Sample Documents:');
        sampleDocs.forEach((doc, index) => {
          console.log(`\n  ${index + 1}. Document ID: ${doc._id}`);
          
          // Show key fields based on collection type
          if (collectionName.toLowerCase().includes('employee')) {
            console.log(`     Name: ${doc.name || doc.employeeName || 'N/A'}`);
            console.log(`     Email: ${doc.email || 'N/A'}`);
            console.log(`     Department: ${doc.department || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('order')) {
            console.log(`     Order Number: ${doc.orderNumber || 'N/A'}`);
            console.log(`     Customer: ${doc.customerName || 'N/A'}`);
            console.log(`     Total: Rs. ${doc.totalAmount || 0}`);
            console.log(`     Status: ${doc.status || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('allowance')) {
            console.log(`     Employee Name: ${doc.employeeName || 'N/A'}`);
            console.log(`     Allowance Type: ${doc.allowanceType || 'N/A'}`);
            console.log(`     Amount: Rs. ${doc.amount || 0}`);
          } else if (collectionName.toLowerCase().includes('salary')) {
            console.log(`     Employee Name: ${doc.employeeName || 'N/A'}`);
            console.log(`     Salary: Rs. ${doc.basicSalary || doc.totalSalary || 0}`);
            console.log(`     Month: ${doc.month || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('attendance')) {
            console.log(`     Employee: ${doc.employeeId || doc.employeeName || 'N/A'}`);
            console.log(`     Date: ${doc.date || doc.attendanceDate || 'N/A'}`);
            console.log(`     Status: ${doc.status || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('leave')) {
            console.log(`     Employee: ${doc.employeeId || doc.employeeName || 'N/A'}`);
            console.log(`     Leave Type: ${doc.leaveType || 'N/A'}`);
            console.log(`     Status: ${doc.status || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('inventory') || collectionName.toLowerCase().includes('product')) {
            console.log(`     Product Name: ${doc.productName || doc.name || 'N/A'}`);
            console.log(`     Quantity: ${doc.quantity || doc.stock || 'N/A'}`);
            console.log(`     Price: Rs. ${doc.price || 0}`);
          } else if (collectionName.toLowerCase().includes('delivery') || collectionName.toLowerCase().includes('driver')) {
            console.log(`     Name: ${doc.name || doc.driverName || 'N/A'}`);
            console.log(`     Status: ${doc.status || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('payment')) {
            console.log(`     Amount: Rs. ${doc.amount || 0}`);
            console.log(`     Status: ${doc.status || doc.paymentStatus || 'N/A'}`);
            console.log(`     Date: ${doc.date || doc.paymentDate || 'N/A'}`);
          } else if (collectionName.toLowerCase().includes('expense')) {
            console.log(`     Description: ${doc.description || doc.expenseType || 'N/A'}`);
            console.log(`     Amount: Rs. ${doc.amount || 0}`);
            console.log(`     Date: ${doc.date || 'N/A'}`);
          } else {
            // Generic display for other collections
            const keys = Object.keys(doc).filter(k => k !== '_id' && k !== '__v' && !k.startsWith('_'));
            keys.slice(0, 3).forEach(key => {
              const value = doc[key];
              if (typeof value !== 'object') {
                console.log(`     ${key}: ${value}`);
              }
            });
          }
        });

        if (count > 3) {
          console.log(`\n  ... and ${count - 3} more documents`);
        }
      } else {
        console.log('\n  ⚠️  No documents found in this collection');
      }
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 DATABASE SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`Total Collections: ${collections.length}`);
    
    let totalDocs = 0;
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      totalDocs += count;
    }
    console.log(`Total Documents: ${totalDocs}`);
    console.log(`Database Name: ${db.databaseName}`);
    console.log(`Connection Status: ✅ Connected`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('❌ Error fetching data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the script
fetchAllData();
