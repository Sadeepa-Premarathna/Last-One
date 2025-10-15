import Delivery from '../models/Delivery.js';
import MilkCollection from '../models/MilkCollection.js';

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

// @desc    Create milk collection delivery
// @route   POST /api/deliveries/milk-collection
// @access  Public
const createMilkCollectionDelivery = async (req, res) => {
  try {
    const { driverId, milkCollectionIds, scheduledDate, route } = req.body;

    // Validate milk collections exist
    const milkCollections = await MilkCollection.find({
      '_id': { $in: milkCollectionIds }
    });

    if (milkCollections.length !== milkCollectionIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some milk collections not found'
      });
    }

    // Generate delivery ID
    const deliveryCount = await Delivery.countDocuments();
    const deliveryId = `MILK-DEL-${String(deliveryCount + 1).padStart(4, '0')}`;

    // Create delivery for milk collection
    const delivery = await Delivery.create({
      deliveryId,
      driver: driverId,
      milkCollections: milkCollectionIds,
      deliveryType: 'Milk Collection',
      deliveryDate: scheduledDate || new Date(),
      route,
      customer: {
        name: 'Milk Collection Route',
        contactNumber: 'N/A',
        address: {
          street: route || 'Collection Route',
          city: 'Various',
          district: 'Various',
          postalCode: 'N/A'
        }
      },
      products: milkCollections.map(collection => ({
        productName: 'Raw Milk Collection',
        productType: 'Fresh Milk',
        quantity: collection.quantity,
        unit: 'Liters',
        pricePerUnit: collection.paymentAmount / collection.quantity || 0,
        totalPrice: collection.paymentAmount || 0
      })),
      deliveryStatus: 'Pending',
      paymentStatus: 'Pending'
    });

    // Update milk collections with delivery reference
    await MilkCollection.updateMany(
      { '_id': { $in: milkCollectionIds } },
      { 
        assignedDelivery: delivery._id,
        status: 'Assigned',
        driverId: driverId
      }
    );

    // Populate and return
    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('driver', 'driverId firstName lastName vehicleNumber contactNumber')
      .populate('milkCollections');

    res.status(201).json({
      success: true,
      data: populatedDelivery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating milk collection delivery',
      error: error.message
    });
  }
};

// @desc    Get milk collection deliveries
// @route   GET /api/deliveries/milk-collection
// @access  Public
const getMilkCollectionDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryType: 'Milk Collection' })
      .populate('driver', 'driverId firstName lastName vehicleNumber contactNumber')
      .populate('milkCollections')
      .sort({ deliveryDate: -1 });

    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching milk collection deliveries',
      error: error.message
    });
  }
};

// @desc    Update milk collection delivery status
// @route   PUT /api/deliveries/milk-collection/:id/status
// @access  Public
const updateMilkCollectionDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const deliveryId = req.params.id;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection delivery not found'
      });
    }

    delivery.deliveryStatus = status;
    await delivery.save();

    // Update associated milk collections status
    let milkCollectionStatus = 'Pending';
    switch (status) {
      case 'In Transit':
        milkCollectionStatus = 'In Transit';
        break;
      case 'Delivered':
        milkCollectionStatus = 'Collected';
        break;
      case 'Failed':
      case 'Cancelled':
        milkCollectionStatus = 'Pending';
        break;
    }

    await MilkCollection.updateMany(
      { assignedDelivery: deliveryId },
      { status: milkCollectionStatus }
    );

    const updatedDelivery = await Delivery.findById(deliveryId)
      .populate('driver', 'driverId firstName lastName vehicleNumber contactNumber')
      .populate('milkCollections');

    res.json({
      success: true,
      data: updatedDelivery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating milk collection delivery status',
      error: error.message
    });
  }
};

export {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveriesByStatus,
  getDeliveriesByDriver,
  getDeliveriesByDateRange,
  createMilkCollectionDelivery,
  getMilkCollectionDeliveries,
  updateMilkCollectionDeliveryStatus
};
