const InventoryRawMilk = require('../models/InventoryRawMilk');

// Get all raw milk collections
const getAllRawMilk = async (req, res) => {
  try {
    const rawMilk = await InventoryRawMilk.find().sort({ collectionDate: -1 });
    res.json(rawMilk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raw milk data', error });
  }
};

// Get raw milk by ID
const getRawMilkById = async (req, res) => {
  try {
    const rawMilk = await InventoryRawMilk.findById(req.params.id);
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json(rawMilk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raw milk data', error });
  }
};

// Create new raw milk collection
const createRawMilk = async (req, res) => {
  try {
    const rawMilk = new InventoryRawMilk(req.body);
    const savedRawMilk = await rawMilk.save();
    res.status(201).json(savedRawMilk);
  } catch (error) {
    res.status(400).json({ message: 'Error creating raw milk record', error: error.message });
  }
};

// Update raw milk collection
const updateRawMilk = async (req, res) => {
  try {
    const rawMilk = await InventoryRawMilk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json(rawMilk);
  } catch (error) {
    res.status(400).json({ message: 'Error updating raw milk record', error: error.message });
  }
};

// Delete raw milk collection
const deleteRawMilk = async (req, res) => {
  try {
    const rawMilk = await InventoryRawMilk.findByIdAndDelete(req.params.id);
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json({ message: 'Raw milk record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting raw milk record', error });
  }
};

// Get statistics
const getRawMilkStats = async (req, res) => {
  try {
    const totalRecords = await InventoryRawMilk.countDocuments();
    const totalQuantity = await InventoryRawMilk.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalAmount = await InventoryRawMilk.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingPayments = await InventoryRawMilk.countDocuments({ paymentStatus: 'pending' });
    
    res.json({
      totalRecords,
      totalQuantity: totalQuantity[0]?.total || 0,
      totalAmount: totalAmount[0]?.total || 0,
      pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

module.exports = {
  getAllRawMilk,
  getRawMilkById,
  createRawMilk,
  updateRawMilk,
  deleteRawMilk,
  getRawMilkStats
};