import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\n✅ Connected to MongoDB - dairy_shop database\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Sri Lankan Delivery Module Data
const deliveryData = {
  // 1. DRIVERS - Sri Lankan delivery drivers
  drivers: [
    {
      driverId: 'DRV001',
      firstName: 'Sarath',
      lastName: 'Bandara',
      nic: '780456789V',
      licenseNumber: 'B1234567',
      contactNumber: '+94 77 234 5678',
      email: 'sarath.bandara@dairylicious.lk',
      address: {
        street: '45, Baseline Road',
        city: 'Colombo 09',
        district: 'Colombo',
        postalCode: '00900'
      },
      vehicleNumber: 'CP-KL-1234',
      vehicleType: 'Refrigerated Van',
      status: 'Active',
      dateOfJoining: new Date('2022-03-15')
    },
    {
      driverId: 'DRV002',
      firstName: 'Pradeep',
      lastName: 'Gunasekara',
      nic: '820678901V',
      licenseNumber: 'B2345678',
      contactNumber: '+94 71 345 6789',
      email: 'pradeep.g@dairylicious.lk',
      address: {
        street: '123, Peradeniya Road',
        city: 'Kandy',
        district: 'Kandy',
        postalCode: '20000'
      },
      vehicleNumber: 'CP-KD-5678',
      vehicleType: 'Refrigerated Truck',
      status: 'Active',
      dateOfJoining: new Date('2021-08-20')
    },
    {
      driverId: 'DRV003',
      firstName: 'Ruwan',
      lastName: 'Dissanayake',
      nic: '860789012V',
      licenseNumber: 'B3456789',
      contactNumber: '+94 76 456 7890',
      email: 'ruwan.d@dairylicious.lk',
      address: {
        street: '78, Matara Road',
        city: 'Galle',
        district: 'Galle',
        postalCode: '80000'
      },
      vehicleNumber: 'SP-GL-9012',
      vehicleType: 'Refrigerated Van',
      status: 'Active',
      dateOfJoining: new Date('2023-01-10')
    }
  ],

  // 2. FARMERS - Sri Lankan dairy farmers
  farmers: [
    {
      farmerId: 'FRM001',
      firstName: 'Mahinda',
      lastName: 'Wijesinghe',
      nic: '750123456V',
      contactNumber: '+94 77 111 2222',
      address: {
        street: 'Watta Road',
        city: 'Horana',
        district: 'Kalutara',
        postalCode: '12400'
      },
      farmLocation: {
        latitude: 6.7156,
        longitude: 80.0622,
        description: 'Near Horana Town'
      },
      numberOfCows: 25,
      status: 'Active'
    },
    {
      farmerId: 'FRM002',
      firstName: 'Upali',
      lastName: 'Rathnayake',
      nic: '800234567V',
      contactNumber: '+94 71 222 3333',
      address: {
        street: 'Dambulla Road',
        city: 'Kurunegala',
        district: 'Kurunegala',
        postalCode: '60000'
      },
      farmLocation: {
        latitude: 7.4863,
        longitude: 80.3647,
        description: 'Kurunegala Town'
      },
      numberOfCows: 35,
      status: 'Active'
    },
    {
      farmerId: 'FRM003',
      firstName: 'Asanka',
      lastName: 'Perera',
      nic: '830345678V',
      contactNumber: '+94 76 333 4444',
      address: {
        street: 'Nuwara Eliya Road',
        city: 'Matale',
        district: 'Matale',
        postalCode: '21000'
      },
      farmLocation: {
        latitude: 7.4675,
        longitude: 80.6234,
        description: 'Near Matale Town'
      },
      numberOfCows: 40,
      status: 'Active'
    },
    {
      farmerId: 'FRM004',
      firstName: 'Lakshman',
      lastName: 'Fernando',
      nic: '770456789V',
      contactNumber: '+94 75 444 5555',
      address: {
        street: 'Anuradhapura Road',
        city: 'Kekirawa',
        district: 'Anuradhapura',
        postalCode: '50100'
      },
      farmLocation: {
        latitude: 8.0336,
        longitude: 80.5981,
        description: 'Kekirawa Junction'
      },
      numberOfCows: 30,
      status: 'Active'
    }
  ],

  // 3. MILK COLLECTIONS - Daily collections from farmers
  milkCollections: [
    {
      collectionId: 'MC-2025-10-001',
      farmerId: 'FRM001',
      farmerName: 'Mahinda Wijesinghe',
      collectionDate: new Date('2025-10-08T06:00:00'),
      quantity: 120,
      qualityGrade: 'A',
      collectionShift: 'Morning',
      unit: 'Liters',
      fat_content: 4.2,
      snf: 8.5,
      protein_content: 3.3,
      temperature: 4.5,
      ph_level: 6.7,
      smell: 'Normal',
      driverId: 'DRV001',
      driverName: 'Sarath Bandara',
      collectionRoute: 'Route A - Horana',
      status: 'Collected'
    },
    {
      collectionId: 'MC-2025-10-002',
      farmerId: 'FRM002',
      farmerName: 'Upali Rathnayake',
      collectionDate: new Date('2025-10-08T06:30:00'),
      quantity: 150,
      qualityGrade: 'A',
      collectionShift: 'Morning',
      unit: 'Liters',
      fat_content: 4.5,
      snf: 8.8,
      protein_content: 3.5,
      temperature: 4.2,
      ph_level: 6.6,
      smell: 'Normal',
      driverId: 'DRV002',
      driverName: 'Pradeep Gunasekara',
      collectionRoute: 'Route B - Kurunegala',
      status: 'Collected'
    },
    {
      collectionId: 'MC-2025-10-003',
      farmerId: 'FRM003',
      farmerName: 'Asanka Perera',
      collectionDate: new Date('2025-10-08T07:00:00'),
      quantity: 180,
      qualityGrade: 'A',
      collectionShift: 'Morning',
      unit: 'Liters',
      fat_content: 4.8,
      snf: 9.0,
      protein_content: 3.7,
      temperature: 4.0,
      ph_level: 6.8,
      smell: 'Normal',
      driverId: 'DRV002',
      driverName: 'Pradeep Gunasekara',
      collectionRoute: 'Route C - Matale',
      status: 'Collected'
    },
    {
      collectionId: 'MC-2025-10-004',
      farmerId: 'FRM004',
      farmerName: 'Lakshman Fernando',
      collectionDate: new Date('2025-10-08T06:15:00'),
      quantity: 140,
      qualityGrade: 'A',
      collectionShift: 'Morning',
      unit: 'Liters',
      fat_content: 4.3,
      snf: 8.6,
      protein_content: 3.4,
      temperature: 4.3,
      ph_level: 6.7,
      smell: 'Normal',
      driverId: 'DRV003',
      driverName: 'Ruwan Dissanayake',
      collectionRoute: 'Route D - Kekirawa',
      status: 'Collected'
    },
    {
      collectionId: 'MC-2025-10-005',
      farmerId: 'FRM001',
      farmerName: 'Mahinda Wijesinghe',
      collectionDate: new Date('2025-10-08T17:00:00'),
      quantity: 100,
      qualityGrade: 'A',
      collectionShift: 'Evening',
      unit: 'Liters',
      fat_content: 4.0,
      snf: 8.3,
      protein_content: 3.2,
      temperature: 4.7,
      ph_level: 6.6,
      smell: 'Normal',
      driverId: 'DRV001',
      driverName: 'Sarath Bandara',
      collectionRoute: 'Route A - Horana',
      status: 'Collected'
    }
  ],

  // 4. DELIVERIES - Customer deliveries with Sri Lankan customers
  deliveries: [
    {
      deliveryId: 'DEL-2025-10-001',
      deliveryDate: new Date('2025-10-08T10:00:00'),
      deliveryType: 'Customer Delivery',
      customer: {
        name: 'Upeksha Restaurant',
        contactNumber: '+94 77 888 9999',
        address: {
          street: '456, Marine Drive',
          city: 'Colombo 03',
          district: 'Colombo',
          postalCode: '00300'
        }
      },
      products: [
        {
          productName: 'Fresh Milk',
          productType: 'Fresh Milk',
          quantity: 50,
          unit: 'Liters',
          pricePerUnit: 250,
          totalPrice: 12500
        },
        {
          productName: 'Curd',
          productType: 'Curd',
          quantity: 30,
          unit: 'Pieces',
          pricePerUnit: 120,
          totalPrice: 3600
        }
      ],
      totalAmount: 16100,
      deliveryStatus: 'Delivered',
      deliveryNotes: 'Morning delivery to restaurant',
      timeSlot: 'Morning (8AM - 12PM)'
    },
    {
      deliveryId: 'DEL-2025-10-002',
      deliveryDate: new Date('2025-10-08T14:00:00'),
      deliveryType: 'Customer Delivery',
      customer: {
        name: 'Saman Grocery - Kandy',
        contactNumber: '+94 81 222 3333',
        address: {
          street: '234, Dalada Veediya',
          city: 'Kandy',
          district: 'Kandy',
          postalCode: '20000'
        }
      },
      products: [
        {
          productName: 'Yogurt',
          productType: 'Yogurt',
          quantity: 100,
          unit: 'Pieces',
          pricePerUnit: 80,
          totalPrice: 8000
        },
        {
          productName: 'Butter',
          productType: 'Butter',
          quantity: 40,
          unit: 'Packets',
          pricePerUnit: 450,
          totalPrice: 18000
        },
        {
          productName: 'Cheese',
          productType: 'Cheese',
          quantity: 20,
          unit: 'Packets',
          pricePerUnit: 950,
          totalPrice: 19000
        }
      ],
      totalAmount: 45000,
      deliveryStatus: 'In Transit',
      deliveryNotes: 'Deliver to back entrance',
      timeSlot: 'Afternoon (12PM - 4PM)'
    },
    {
      deliveryId: 'DEL-2025-10-003',
      deliveryDate: new Date('2025-10-08T09:30:00'),
      deliveryType: 'Customer Delivery',
      customer: {
        name: 'Nimal Supermarket',
        contactNumber: '+94 91 234 5678',
        address: {
          street: '89, Main Street',
          city: 'Galle',
          district: 'Galle',
          postalCode: '80000'
        }
      },
      products: [
        {
          productName: 'Fresh Milk',
          productType: 'Fresh Milk',
          quantity: 80,
          unit: 'Liters',
          pricePerUnit: 250,
          totalPrice: 20000
        },
        {
          productName: 'Ice Cream',
          productType: 'Ice Cream',
          quantity: 25,
          unit: 'Liters',
          pricePerUnit: 800,
          totalPrice: 20000
        }
      ],
      totalAmount: 40000,
      deliveryStatus: 'Delivered',
      deliveryNotes: 'Cold storage ready',
      timeSlot: 'Morning (8AM - 12PM)'
    },
    {
      deliveryId: 'DEL-2025-10-004',
      deliveryDate: new Date('2025-10-08T16:00:00'),
      deliveryType: 'Customer Delivery',
      customer: {
        name: 'Hotel Sudu Araliya',
        contactNumber: '+94 37 222 4444',
        address: {
          street: '12, Beach Road',
          city: 'Negombo',
          district: 'Gampaha',
          postalCode: '11500'
        }
      },
      products: [
        {
          productName: 'Fresh Milk',
          productType: 'Fresh Milk',
          quantity: 40,
          unit: 'Liters',
          pricePerUnit: 250,
          totalPrice: 10000
        },
        {
          productName: 'Butter',
          productType: 'Butter',
          quantity: 20,
          unit: 'Packets',
          pricePerUnit: 450,
          totalPrice: 9000
        },
        {
          productName: 'Yogurt',
          productType: 'Yogurt',
          quantity: 50,
          unit: 'Pieces',
          pricePerUnit: 80,
          totalPrice: 4000
        }
      ],
      totalAmount: 23000,
      deliveryStatus: 'Pending',
      deliveryNotes: 'Hotel order - deliver to kitchen',
      timeSlot: 'Evening (4PM - 8PM)'
    },
    {
      deliveryId: 'DEL-2025-10-005',
      deliveryDate: new Date('2025-10-08T11:00:00'),
      deliveryType: 'Customer Delivery',
      customer: {
        name: 'Lakshmi Stores',
        contactNumber: '+94 37 234 5678',
        address: {
          street: '67, Kurunegala Road',
          city: 'Kurunegala',
          district: 'Kurunegala',
          postalCode: '60000'
        }
      },
      products: [
        {
          productName: 'Curd',
          productType: 'Curd',
          quantity: 80,
          unit: 'Pieces',
          pricePerUnit: 120,
          totalPrice: 9600
        },
        {
          productName: 'Yogurt',
          productType: 'Yogurt',
          quantity: 60,
          unit: 'Pieces',
          pricePerUnit: 80,
          totalPrice: 4800
        }
      ],
      totalAmount: 14400,
      deliveryStatus: 'Delivered',
      deliveryNotes: 'Weekly delivery',
      timeSlot: 'Morning (8AM - 12PM)'
    }
  ]
};

// Seed the database
async function seedDeliveryData() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    
    console.log('🗑️  Clearing existing delivery data...\n');
    
    // Clear existing data
    await db.collection('drivers').deleteMany({});
    await db.collection('farmers').deleteMany({});
    await db.collection('milkcollections').deleteMany({});
    await db.collection('deliveries').deleteMany({});
    
    // Drop the problematic index with underscore (delivery_id)
    try {
      await db.collection('deliveries').dropIndex('delivery_id_1');
      console.log('✓ Dropped old delivery_id index');
    } catch (error) {
      // Index might not exist, that's okay
    }
    
    console.log('✅ Cleared delivery collections\n');
    
    // Insert Drivers
    console.log('🚚 Seeding Drivers...');
    const driversResult = await db.collection('drivers').insertMany(deliveryData.drivers);
    const driverIds = Object.values(driversResult.insertedIds);
    console.log(`   ✓ Added ${driverIds.length} drivers`);
    
    // Insert Farmers
    console.log('👨‍🌾 Seeding Farmers...');
    const farmersResult = await db.collection('farmers').insertMany(deliveryData.farmers);
    const farmerIds = Object.values(farmersResult.insertedIds);
    console.log(`   ✓ Added ${farmerIds.length} farmers`);
    
    // Update Milk Collections with proper references
    console.log('🥛 Seeding Milk Collections...');
    const milkCollectionsWithRefs = deliveryData.milkCollections.map((mc, index) => ({
      ...mc,
      farmer: farmerIds[index % farmerIds.length],
      driver: driverIds[index % driverIds.length]
    }));
    
    const milkCollectionsResult = await db.collection('milkcollections').insertMany(milkCollectionsWithRefs);
    const milkCollectionIds = Object.values(milkCollectionsResult.insertedIds);
    console.log(`   ✓ Added ${milkCollectionIds.length} milk collections`);
    
    // Update Deliveries with proper references
    console.log('📦 Seeding Deliveries...');
    const deliveriesWithRefs = deliveryData.deliveries.map((delivery, index) => ({
      ...delivery,
      driver: driverIds[index % driverIds.length],
      milkCollections: [] // Empty for customer deliveries
    }));
    
    await db.collection('deliveries').insertMany(deliveriesWithRefs);
    console.log(`   ✓ Added ${deliveriesWithRefs.length} deliveries`);
    
    console.log('\n===================================================================');
    console.log('✨ DELIVERY MODULE SEEDED SUCCESSFULLY WITH SRI LANKAN DATA');
    console.log('===================================================================');
    console.log('📊 Summary:');
    console.log(`   Drivers: ${driverIds.length} records`);
    console.log(`   Farmers: ${farmerIds.length} records`);
    console.log(`   Milk Collections: ${milkCollectionIds.length} records`);
    console.log(`   Deliveries: ${deliveriesWithRefs.length} records`);
    console.log(`   Total Records: ${driverIds.length + farmerIds.length + milkCollectionIds.length + deliveriesWithRefs.length}`);
    console.log('\n✅ All data uses Sri Lankan names, addresses, and phone numbers');
    console.log('✅ Currency in Sri Lankan Rupees (Rs.)');
    console.log('✅ Cities: Colombo, Kandy, Galle, Negombo, Kurunegala, Horana, Matale, Kekirawa');
    console.log('✅ Districts: Colombo, Kandy, Galle, Gampaha, Kurunegala, Kalutara, Matale, Anuradhapura\n');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  }
}

// Run the seeder
seedDeliveryData();
