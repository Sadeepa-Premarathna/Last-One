import MilkCollection from '../Inventorymodels/InventoryMilkCollection.js';
import { validationResult } from 'express-validator';

// Get all milk collections
const getAllMilkCollections = async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = '-collectionDate' } = req.query;
    
    const milkCollections = await MilkCollection.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await MilkCollection.countDocuments();

    res.json({
      success: true,
      data: milkCollections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching milk collections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milk collections',
      error: error.message
    });
  }
};

// Get milk collection by ID
const getMilkCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const milkCollection = await MilkCollection.findById(id);

    if (!milkCollection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }

    res.json({
      success: true,
      data: milkCollection
    });
  } catch (error) {
    console.error('Error fetching milk collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milk collection',
      error: error.message
    });
  }
};

// Get milk collection statistics
const getMilkCollectionStats = async (req, res) => {
  try {
    const totalCollections = await MilkCollection.countDocuments();
    const totalQuantity = await MilkCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalAmount = await MilkCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingPayments = await MilkCollection.countDocuments({ paymentStatus: 'pending' });
    
    // Daily collection data for charts
    const dailyCollections = await MilkCollection.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$collectionDate' } },
          quantity: { $sum: '$quantity' },
          amount: { $sum: '$totalAmount' },
          collections: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    // Top farmers by quantity
    const topFarmers = await MilkCollection.aggregate([
      {
        $group: {
          _id: '$farmerName',
          totalQuantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$totalAmount' },
          collections: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // Quality distribution
    const qualityDistribution = await MilkCollection.aggregate([
      {
        $group: {
          _id: '$qualityGrade',
          count: { $sum: 1 },
          quantity: { $sum: '$quantity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCollections,
          totalQuantity: totalQuantity[0]?.total || 0,
          totalAmount: totalAmount[0]?.total || 0,
          pendingPayments,
          averageQuantity: totalQuantity[0]?.total / totalCollections || 0
        },
        dailyCollections,
        topFarmers,
        qualityDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching milk collection stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Create new milk collection
const createMilkCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const milkCollection = new MilkCollection(req.body);
    const savedCollection = await milkCollection.save();

    res.status(201).json({
      success: true,
      data: savedCollection,
      message: 'Milk collection created successfully'
    });
  } catch (error) {
    console.error('Error creating milk collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create milk collection',
      error: error.message
    });
  }
};

// Update milk collection
const updateMilkCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const milkCollection = await MilkCollection.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!milkCollection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }

    res.json({
      success: true,
      data: milkCollection,
      message: 'Milk collection updated successfully'
    });
  } catch (error) {
    console.error('Error updating milk collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update milk collection',
      error: error.message
    });
  }
};

// Delete milk collection
const deleteMilkCollection = async (req, res) => {
  try {
    const { id } = req.params;
    
    const milkCollection = await MilkCollection.findByIdAndDelete(id);

    if (!milkCollection) {
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
    console.error('Error deleting milk collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete milk collection',
      error: error.message
    });
  }
};

export {
  getAllMilkCollections,
  getMilkCollectionById,
  getMilkCollectionStats,
  createMilkCollection,
  updateMilkCollection,
  deleteMilkCollection
};