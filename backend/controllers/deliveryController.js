const Delivery = require('../models/Delivery');

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Public
const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('driver', 'driverId firstName lastName vehicleNumber contactNumber')
      .sort({ deliveryDate: -1 });
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message
    });
  }
};

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Public
const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('driver');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message
    });
  }
};

// @desc    Create new delivery
// @route   POST /api/deliveries
// @access  Public
const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('driver', 'driverId firstName lastName vehicleNumber');
    
    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: populatedDelivery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating delivery',
      error: error.message
    });
  }
};

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Public
const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driver');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating delivery',
      error: error.message
    });
  }
};

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Public
const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery',
      error: error.message
    });
  }
};

// @desc    Get deliveries by status
// @route   GET /api/deliveries/status/:status
// @access  Public
const getDeliveriesByStatus = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryStatus: req.params.status })
      .populate('driver', 'driverId firstName lastName')
      .sort({ deliveryDate: -1 });
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries by status',
      error: error.message
    });
  }
};

// @desc    Get deliveries by driver
// @route   GET /api/deliveries/driver/:driverId
// @access  Public
const getDeliveriesByDriver = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ driver: req.params.driverId })
      .sort({ deliveryDate: -1 });
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver deliveries',
      error: error.message
    });
  }
};

// @desc    Get deliveries by date range
// @route   GET /api/deliveries/date-range
// @access  Public
const getDeliveriesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('driver', 'driverId firstName lastName')
    .sort({ deliveryDate: -1 });
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries by date range',
      error: error.message
    });
  }
};

module.exports = {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveriesByStatus,
  getDeliveriesByDriver,
  getDeliveriesByDateRange
};
