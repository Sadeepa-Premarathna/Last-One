const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

// Sample orders data
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
      postalCode: '00300'
    },
    products: [
      {
        productName: 'Fresh Milk 1L',
        quantity: 5,
        unitPrice: 250,
        totalPrice: 1250
      },
      {
        productName: 'Yogurt 500ml',
        quantity: 3,
        unitPrice: 180,
        totalPrice: 540
      }
    ],
    totalAmount: 1790,
    orderDate: new Date('2024-10-01'),
    requestedDeliveryDate: new Date('2024-10-05'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    notes: 'Please deliver before 9 AM'
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
      {
        productName: 'Butter 250g',
        quantity: 2,
        unitPrice: 450,
        totalPrice: 900
      },
      {
        productName: 'Cheese 200g',
        quantity: 1,
        unitPrice: 650,
        totalPrice: 650
      }
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
      {
        productName: 'Fresh Milk 1L',
        quantity: 10,
        unitPrice: 250,
        totalPrice: 2500
      },
      {
        productName: 'Curd 400ml',
        quantity: 5,
        unitPrice: 200,
        totalPrice: 1000
      }
    ],
    totalAmount: 3500,
    orderDate: new Date('2024-10-03'),
    requestedDeliveryDate: new Date('2024-10-07'),
    status: 'Pending',
    paymentStatus: 'Paid',
    paymentMethod: 'Card'
  },
  {
    orderId: 'ORD-004',
    customerName: 'Rajitha Jayawardena',
    customerPhone: '0774567890',
    customerEmail: 'rajitha@email.com',
    deliveryAddress: {
      street: '321 Matara Road',
      city: 'Galle',
      district: 'Galle',
      postalCode: '80000'
    },
    products: [
      {
        productName: 'Cheese 200g',
        quantity: 3,
        unitPrice: 650,
        totalPrice: 1950
      }
    ],
    totalAmount: 1950,
    orderDate: new Date('2024-10-04'),
    requestedDeliveryDate: new Date('2024-10-08'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash'
  },
  {
    orderId: 'ORD-005',
    customerName: 'Chamari Wickramasinghe',
    customerPhone: '0775678901',
    customerEmail: 'chamari@email.com',
    deliveryAddress: {
      street: '654 Kurunegala Road',
      city: 'Kurunegala',
      district: 'Kurunegala',
      postalCode: '60000'
    },
    products: [
      {
        productName: 'Fresh Milk 1L',
        quantity: 8,
        unitPrice: 250,
        totalPrice: 2000
      },
      {
        productName: 'Yogurt 500ml',
        quantity: 6,
        unitPrice: 180,
        totalPrice: 1080
      },
      {
        productName: 'Butter 250g',
        quantity: 1,
        unitPrice: 450,
        totalPrice: 450
      }
    ],
    totalAmount: 3530,
    orderDate: new Date('2024-10-05'),
    requestedDeliveryDate: new Date('2024-10-09'),
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer'
  }
];

const seedOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing orders (optional)
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Insert sample orders
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Successfully added ${createdOrders.length} sample orders`);

    console.log('\n📦 Sample Orders:');
    createdOrders.forEach(order => {
      console.log(`- ${order.orderId}: ${order.customerName} - Rs.${order.totalAmount}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
