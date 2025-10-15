import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fetchDeliveryData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB - dairy_shop database\n');
    
    const db = mongoose.connection.db;
    
    // Fetch Drivers
    const drivers = await db.collection('drivers').find().toArray();
    console.log('🚚 DRIVERS (' + drivers.length + ' records):');
    drivers.forEach((driver, index) => {
      console.log(`\n${index + 1}. ${driver.firstName} ${driver.lastName} (${driver.driverId})`);
      console.log(`   NIC: ${driver.nic}`);
      console.log(`   License: ${driver.licenseNumber}`);
      console.log(`   Phone: ${driver.contactNumber}`);
      console.log(`   Vehicle: ${driver.vehicleNumber} (${driver.vehicleType})`);
      console.log(`   Location: ${driver.address.city}, ${driver.address.district}`);
      console.log(`   Status: ${driver.status}`);
    });
    
    // Fetch Farmers
    const farmers = await db.collection('farmers').find().toArray();
    console.log('\n\n👨‍🌾 FARMERS (' + farmers.length + ' records):');
    farmers.forEach((farmer, index) => {
      console.log(`\n${index + 1}. ${farmer.firstName} ${farmer.lastName} (${farmer.farmerId})`);
      console.log(`   NIC: ${farmer.nic}`);
      console.log(`   Phone: ${farmer.contactNumber}`);
      console.log(`   Cows: ${farmer.numberOfCows}`);
      console.log(`   Location: ${farmer.address.city}, ${farmer.address.district}`);
      console.log(`   Status: ${farmer.status}`);
    });
    
    // Fetch Milk Collections
    const milkCollections = await db.collection('milkcollections').find().sort({ collectionDate: -1 }).toArray();
    console.log('\n\n🥛 MILK COLLECTIONS (' + milkCollections.length + ' records):');
    milkCollections.forEach((mc, index) => {
      console.log(`\n${index + 1}. ${mc.collectionId}`);
      console.log(`   Farmer: ${mc.farmerName} (${mc.farmerId})`);
      console.log(`   Driver: ${mc.driverName} (${mc.driverId})`);
      console.log(`   Date: ${new Date(mc.collectionDate).toLocaleString()}`);
      console.log(`   Quantity: ${mc.quantity} ${mc.unit}`);
      console.log(`   Grade: ${mc.qualityGrade} | Shift: ${mc.collectionShift}`);
      console.log(`   Route: ${mc.collectionRoute}`);
      console.log(`   Status: ${mc.status}`);
    });
    
    // Fetch Deliveries
    const deliveries = await db.collection('deliveries').find().sort({ deliveryDate: -1 }).toArray();
    console.log('\n\n📦 DELIVERIES (' + deliveries.length + ' records):');
    deliveries.forEach((delivery, index) => {
      console.log(`\n${index + 1}. ${delivery.deliveryId}`);
      console.log(`   Customer: ${delivery.customer.name}`);
      console.log(`   Phone: ${delivery.customer.contactNumber}`);
      console.log(`   Address: ${delivery.customer.address.city}, ${delivery.customer.address.district}`);
      console.log(`   Date: ${new Date(delivery.deliveryDate).toLocaleString()}`);
      console.log(`   Time Slot: ${delivery.timeSlot}`);
      console.log(`   Products:`);
      delivery.products.forEach(product => {
        console.log(`      - ${product.productName}: ${product.quantity} ${product.unit} × Rs. ${product.pricePerUnit} = Rs. ${product.totalPrice}`);
      });
      console.log(`   Total Amount: Rs. ${delivery.totalAmount}`);
      console.log(`   Status: ${delivery.deliveryStatus}`);
      if (delivery.deliveryNotes) {
        console.log(`   Notes: ${delivery.deliveryNotes}`);
      }
    });
    
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(70));
    console.log(`Drivers: ${drivers.length} records`);
    console.log(`Farmers: ${farmers.length} records`);
    console.log(`Milk Collections: ${milkCollections.length} records`);
    console.log(`Deliveries: ${deliveries.length} records`);
    console.log(`Total: ${drivers.length + farmers.length + milkCollections.length + deliveries.length} records`);
    console.log('='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Connection closed\n');
    process.exit(0);
  }
}

fetchDeliveryData();
