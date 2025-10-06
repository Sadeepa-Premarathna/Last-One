const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('assignedDriver', 'firstName lastName driverId contactNumber vehicleNumber')
      .sort({ orderDate: -1 });
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedDriver', 'firstName lastName driverId contactNumber vehicleNumber');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Assign driver to order
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        assignedDriver: driverId,
        status: driverId ? 'Assigned' : 'Pending'
      },
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'firstName lastName driverId contactNumber vehicleNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error assigning driver',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    
    // If status is Delivered, set deliveredDate
    if (status === 'Delivered') {
      updateData.deliveredDate = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'firstName lastName driverId contactNumber vehicleNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentMethod },
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'firstName lastName driverId contactNumber vehicleNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};
