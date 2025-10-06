const Farmer = require('../models/Farmer');

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Public
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmers',
      error: error.message
    });
  }
};

// @desc    Get single farmer
// @route   GET /api/farmers/:id
// @access  Public
const getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: farmer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer',
      error: error.message
    });
  }
};

// @desc    Create new farmer
// @route   POST /api/farmers
// @access  Public
const createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: farmer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating farmer',
      error: error.message
    });
  }
};

// @desc    Update farmer
// @route   PUT /api/farmers/:id
// @access  Public
const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      message: 'Farmer updated successfully',
      data: farmer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating farmer',
      error: error.message
    });
  }
};

// @desc    Delete farmer
// @route   DELETE /api/farmers/:id
// @access  Public
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      message: 'Farmer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting farmer',
      error: error.message
    });
  }
};

// @desc    Get active farmers
// @route   GET /api/farmers/status/active
// @access  Public
const getActiveFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active farmers',
      error: error.message
    });
  }
};

module.exports = {
  getFarmers,
  getFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  getActiveFarmers
};
