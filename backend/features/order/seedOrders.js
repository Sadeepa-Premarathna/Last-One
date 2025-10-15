import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    items: [
      {
        productName: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Delivered'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Refunded'],
      default: 'Unpaid',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderManagement = mongoose.model('OrderManagement', orderSchema);

// Sample orders
const sampleOrders = [
  {
    orderNumber: 'ORD-000001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+94 77 123 4567',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 10, price: 250, total: 2500 },
      { productName: 'Yogurt 500ml', quantity: 5, price: 180, total: 900 },
    ],
    totalAmount: 3400,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '123 Main Street',
      city: 'Colombo',
      state: 'Western Province',
      zipCode: '00100',
    },
    orderDate: new Date('2024-01-15'),
    deliveryDate: new Date('2024-01-16'),
    notes: 'Customer prefers morning delivery',
  },
  {
    orderNumber: 'ORD-000002',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    customerPhone: '+94 71 234 5678',
    items: [
      { productName: 'Butter 250g', quantity: 3, price: 450, total: 1350 },
      { productName: 'Cheese 200g', quantity: 2, price: 550, total: 1100 },
      { productName: 'Fresh Milk 1L', quantity: 5, price: 250, total: 1250 },
    ],
    totalAmount: 3700,
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '456 Park Avenue',
      city: 'Kandy',
      state: 'Central Province',
      zipCode: '20000',
    },
    orderDate: new Date('2024-01-20'),
    notes: 'Handle with care',
  },
  {
    orderNumber: 'ORD-000003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob.johnson@email.com',
    customerPhone: '+94 76 345 6789',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 20, price: 250, total: 5000 },
      { productName: 'Curd 400ml', quantity: 10, price: 120, total: 1200 },
    ],
    totalAmount: 6200,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    deliveryAddress: {
      street: '789 Lake Road',
      city: 'Galle',
      state: 'Southern Province',
      zipCode: '80000',
    },
    orderDate: new Date(),
    notes: 'Please call before delivery',
  },
  {
    orderNumber: 'ORD-000004',
    customerName: 'Alice Williams',
    customerEmail: 'alice.williams@email.com',
    customerPhone: '+94 75 456 7890',
    items: [
      { productName: 'Ice Cream 1L', quantity: 4, price: 680, total: 2720 },
      { productName: 'Yogurt 500ml', quantity: 8, price: 180, total: 1440 },
    ],
    totalAmount: 4160,
    status: 'Completed',
    paymentStatus: 'Paid',
    deliveryAddress: {
      street: '321 Beach Road',
      city: 'Negombo',
      state: 'Western Province',
      zipCode: '11500',
    },
    orderDate: new Date('2024-01-18'),
    deliveryDate: new Date('2024-01-19'),
  },
  {
    orderNumber: 'ORD-000005',
    customerName: 'Charlie Brown',
    customerEmail: 'charlie.brown@email.com',
    customerPhone: '+94 70 567 8901',
    items: [
      { productName: 'Fresh Milk 1L', quantity: 15, price: 250, total: 3750 },
      { productName: 'Butter 250g', quantity: 5, price: 450, total: 2250 },
      { productName: 'Cheese 200g', quantity: 3, price: 550, total: 1650 },
    ],
    totalAmount: 7650,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    deliveryAddress: {
      street: '555 Hill Street',
      city: 'Nuwara Eliya',
      state: 'Central Province',
      zipCode: '22200',
    },
    orderDate: new Date('2024-01-12'),
    notes: 'Customer requested cancellation',
  },
];

// Connect and seed
async function seedOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing orders
    await OrderManagement.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Insert sample orders
    await OrderManagement.insertMany(sampleOrders);
    console.log('✅ Successfully added 5 sample orders!');

    // Display orders
    const orders = await OrderManagement.find().sort({ createdAt: -1 });
    console.log('\n📋 Sample Orders:');
    orders.forEach((order) => {
      console.log(
        `   ${order.orderNumber} - ${order.customerName} - ${order.status} - Rs. ${order.totalAmount}`
      );
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedOrders();
