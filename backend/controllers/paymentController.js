const Payment = require('../models/Payment');
const MilkCollection = require('../models/MilkCollection');
const Farmer = require('../models/Farmer');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('farmerId', 'firstName lastName farmerId contactNumber')
      .populate('collectionId', 'collectionId quantity collectionDate')
      .sort({ paymentDate: -1 });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// Get single payment
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('farmerId', 'firstName lastName farmerId contactNumber')
      .populate('collectionId');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

// Get pending payments (unpaid collections)
exports.getPendingPayments = async (req, res) => {
  try {
    const pendingCollections = await MilkCollection.find({ 
      paymentStatus: 'Pending',
      status: { $ne: 'Rejected' }
    })
    .populate('farmer', 'firstName lastName farmerId contactNumber')
    .sort({ collectionDate: -1 });
    
    res.status(200).json({
      success: true,
      count: pendingCollections.length,
      data: pendingCollections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending payments',
      error: error.message
    });
  }
};

// Get payments by farmer
exports.getPaymentsByFarmer = async (req, res) => {
  try {
    const payments = await Payment.find({ farmerId: req.params.farmerId })
      .populate('collectionId', 'collectionId quantity collectionDate')
      .sort({ paymentDate: -1 });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer payments',
      error: error.message
    });
  }
};

// Create payment for collection
exports.createPayment = async (req, res) => {
  try {
    const { collectionId, paymentMethod, transactionReference, bankDetails, notes, paidBy, receiptNumber } = req.body;
    
    // Find the collection
    const collection = await MilkCollection.findById(collectionId).populate('farmer');
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Milk collection not found'
      });
    }
    
    // Check if payment already exists
    const existingPayment = await Payment.findOne({ collectionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this collection'
      });
    }
    
    // Create payment
    const payment = await Payment.create({
      collectionId,
      farmerId: collection.farmer._id,
      farmerName: `${collection.farmer.firstName} ${collection.farmer.lastName}`,
      amount: collection.totalAmount,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: 'Completed',
      transactionReference,
      bankDetails,
      notes,
      paidBy,
      receiptNumber
    });
    
    // Update collection payment status
    collection.paymentStatus = 'Paid';
    await collection.save();
    
    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Update collection status back to pending
    await MilkCollection.findByIdAndUpdate(
      payment.collectionId,
      { paymentStatus: 'Pending' }
    );
    
    await payment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error.message
    });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPaid = await Payment.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalPending = await MilkCollection.aggregate([
      { $match: { paymentStatus: 'Pending', status: { $ne: 'Rejected' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const paymentCount = await Payment.countDocuments({ paymentStatus: 'Completed' });
    const pendingCount = await MilkCollection.countDocuments({ 
      paymentStatus: 'Pending',
      status: { $ne: 'Rejected' }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalPaid: totalPaid[0]?.total || 0,
        totalPending: totalPending[0]?.total || 0,
        completedPayments: paymentCount,
        pendingPayments: pendingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};
