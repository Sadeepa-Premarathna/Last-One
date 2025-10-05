const mongoose = require('mongoose');

// Connect directly with dairy_shop database
const MONGODB_URI = 'mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/dairy_shop';

const sampleOrders = [
  {
    orderId: 'ORD-001',
    customerName: 'Kasun Perera',
    customerPhone: '0771234567',
    customerEmail: 'kasun@email.com',
    deliveryAddress: {
      street: '123 Galle Road',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00100'
    },
    products: [
      { productName: 'Fresh Milk 1L', quantity: 2, unitPrice: 300, totalPrice: 600 },
      { productName: 'Curd 500ml', quantity: 3, unitPrice: 150, totalPrice: 450 }
    ],
    totalAmount: 1050,
    orderDate: new Date('2024-10-01'),
    requestedDeliveryDate: new Date('2024-10-05'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash'
  },
  {
    orderId: 'ORD-002',
    customerName: 'Nimal Silva',
    customerPhone: '0772345678',
    customerEmail: 'nimal@email.com',
    deliveryAddress: {
      street: '456 Kandy Road',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000'
    },
    products: [
      { productName: 'Butter 250g', quantity: 2, unitPrice: 450, totalPrice: 900 },
      { productName: 'Cheese 200g', quantity: 1, unitPrice: 650, totalPrice: 650 }
    ],
    totalAmount: 1550,
    orderDate: new Date('2024-10-02'),
    requestedDeliveryDate: new Date('2024-10-06'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Online'
  },
  {
    orderId: 'ORD-003',
    customerName: 'Sanduni Fernando',
    customerPhone: '0773456789',
    customerEmail: 'sanduni@email.com',
    deliveryAddress: {
      street: '789 Negombo Road',
      city: 'Negombo',
      district: 'Gampaha',
      postalCode: '11500'
    },
    products: [
      { productName: 'Yogurt 200ml', quantity: 5, unitPrice: 80, totalPrice: 400 },
      { productName: 'Fresh Milk 1L', quantity: 1, unitPrice: 300, totalPrice: 300 }
    ],
    totalAmount: 700,
    orderDate: new Date('2024-10-03'),
    requestedDeliveryDate: new Date('2024-10-07'),
    status: 'Assigned',
    paymentStatus: 'Paid',
    paymentMethod: 'Card'
  },
  {
    orderId: 'ORD-004',
    customerName: 'Rajitha Bandara',
    customerPhone: '0774567890',
    customerEmail: 'rajitha@email.com',
    deliveryAddress: {
      street: '321 Galle Face',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00200'
    },
    products: [
      { productName: 'Cheese 200g', quantity: 3, unitPrice: 650, totalPrice: 1950 },
      { productName: 'Butter 250g', quantity: 1, unitPrice: 450, totalPrice: 450 }
    ],
    totalAmount: 2400,
    orderDate: new Date('2024-10-04'),
    requestedDeliveryDate: new Date('2024-10-08'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash'
  },
  {
    orderId: 'ORD-005',
    customerName: 'Amaya Wijesinghe',
    customerPhone: '0775678901',
    customerEmail: 'amaya@email.com',
    deliveryAddress: {
      street: '654 Matara Road',
      city: 'Matara',
      district: 'Matara',
      postalCode: '81000'
    },
    products: [
      { productName: 'Fresh Milk 1L', quantity: 4, unitPrice: 300, totalPrice: 1200 },
      { productName: 'Curd 500ml', quantity: 2, unitPrice: 150, totalPrice: 300 }
    ],
    totalAmount: 1500,
    orderDate: new Date('2024-10-05'),
    requestedDeliveryDate: new Date('2024-10-09'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer'
  }
];

async function createOrders() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // Clear existing orders
    await ordersCollection.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Insert new orders
    const result = await ordersCollection.insertMany(sampleOrders);
    console.log(`✅ Successfully inserted ${result.insertedCount} orders`);

    console.log('\n📦 Sample Orders:');
    sampleOrders.forEach(order => {
      console.log(`- ${order.orderId}: ${order.customerName} - Rs.${order.totalAmount}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createOrders();
