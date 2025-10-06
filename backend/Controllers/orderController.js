const Order = require('../Model/Order');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product');
const Counter = require('../Model/CounterOrd'); // Import the new Counter model
const mongoose = require('mongoose');

// Helper function to get the next sequence number
const getNextSequence = async (name) => {
  const ret = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const cartUserId = req.user?.id || req.session?.guestId || `guest_${Date.now()}`;
    const { shippingAddress, paymentMethod, items } = req.body;

    if (!shippingAddress || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Generate sequential orderNumber
    const sequence = await getNextSequence('orders');
    const orderNumber = `ORD${sequence.toString().padStart(6, '0')}`;

    // Handle userId for authenticated users vs guests
    let userId;
    let guestId = null;
    if (mongoose.Types.ObjectId.isValid(cartUserId)) {
      userId = cartUserId;
    } else {
      userId = new mongoose.Types.ObjectId();
      guestId = cartUserId;
    }

    const order = new Order({
      userId,
      guestId,
      orderId: orderNumber,
      orderNumber,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingCost: 0, // Free shipping for now
      taxAmount: totalAmount * 0.1, // 10% tax
      discountAmount: 0
    });

    await order.save();

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: cartUserId },
      { items: [], totalPrice: 0 }
    );

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userIdentifier = req.user?.id || req.session?.guestId;
    
    if (!userIdentifier) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(userIdentifier)) {
      query = { userId: new mongoose.Types.ObjectId(userIdentifier) };
    } else {
      query = { guestId: userIdentifier };
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};