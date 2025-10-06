const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const insertOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);

    // Define a simple order schema inline to avoid any model issues
    const OrderSchema = new mongoose.Schema({
      orderId: String,
      customerName: String,
      customerPhone: String,
      customerEmail: String,
      deliveryAddress: {
        street: String,
        city: String,
        district: String,
        postalCode: String
      },
      products: [{
        productName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
      }],
      totalAmount: Number,
      orderDate: Date,
      requestedDeliveryDate: Date,
      status: { type: String, default: 'Pending' },
      paymentStatus: { type: String, default: 'Pending' },
      paymentMethod: String
    }, { timestamps: true });

    const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

    const sampleOrder = {
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
        {
          productName: 'Fresh Milk 1L',
          quantity: 2,
          unitPrice: 300,
          totalPrice: 600
        },
        {
          productName: 'Curd 500ml',
          quantity: 3,
          unitPrice: 150,
          totalPrice: 450
        }
      ],
      totalAmount: 1050,
      orderDate: new Date(),
      requestedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'Cash'
    };

    const order = await Order.create(sampleOrder);
    console.log('✅ Successfully created order:', order.orderId);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

insertOrder();
