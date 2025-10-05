const MilkCollection = require('../models/MilkCollection');

// @desc    Get all milk collections
// @route   GET /api/milk-collections
// @access  Public
const getMilkCollections = async (req, res) => {
  try {
    const collections = await MilkCollection.find()
      .populate('farmer', 'farmerId firstName lastName contactNumber')
      .populate('driver', 'driverId firstName lastName vehicleNumber')
      .sort({ collectionDate: -1 });
    
    res.json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching milk collections',
      error: error.message
    });
  }
};

// @desc    Get single milk collection
// @route   GET /api/milk-collections/:id
// @access  Public
const getMilkCollection = async (req, res) => {
  try {
    const collection = await MilkCollection.findById(req.params.id)
      .populate('farmer')
      .populate('driver');
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching milk collection',
      error: error.message
    });
  }
};

// @desc    Create new milk collection
// @route   POST /api/milk-collections
// @access  Public
const createMilkCollection = async (req, res) => {
  try {
    const collection = await MilkCollection.create(req.body);
    const populatedCollection = await MilkCollection.findById(collection._id)
      .populate('farmer', 'farmerId firstName lastName')
      .populate('driver', 'driverId firstName lastName');
    
    res.status(201).json({
      success: true,
      message: 'Milk collection recorded successfully',
      data: populatedCollection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating milk collection',
      error: error.message
    });
  }
};

// @desc    Update milk collection
// @route   PUT /api/milk-collections/:id
// @access  Public
const updateMilkCollection = async (req, res) => {
  try {
    const collection = await MilkCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('farmer')
    .populate('driver');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Milk collection updated successfully',
      data: collection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating milk collection',
      error: error.message
    });
  }
};

// @desc    Delete milk collection
// @route   DELETE /api/milk-collections/:id
// @access  Public
const deleteMilkCollection = async (req, res) => {
  try {
    const collection = await MilkCollection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Milk collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting milk collection',
      error: error.message
    });
  }
};

// @desc    Get milk collections by farmer
// @route   GET /api/milk-collections/farmer/:farmerId
// @access  Public
const getCollectionsByFarmer = async (req, res) => {
  try {
    const collections = await MilkCollection.find({ farmer: req.params.farmerId })
      .populate('driver', 'driverId firstName lastName')
      .sort({ collectionDate: -1 });
    
    res.json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer collections',
      error: error.message
    });
  }
};

// @desc    Get milk collections by date range
// @route   GET /api/milk-collections/date-range
// @access  Public
const getCollectionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const collections = await MilkCollection.find({
      collectionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('farmer', 'farmerId firstName lastName')
    .populate('driver', 'driverId firstName lastName')
    .sort({ collectionDate: -1 });
    
    res.json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching collections by date range',
      error: error.message
    });
  }
};

module.exports = {
  getMilkCollections,
  getMilkCollection,
  createMilkCollection,
  updateMilkCollection,
  deleteMilkCollection,
  getCollectionsByFarmer,
  getCollectionsByDateRange
};
