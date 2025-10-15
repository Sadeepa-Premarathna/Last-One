import Payment from '../models/Payment.js';
import MilkCollection from '../models/MilkCollection.js';
import Farmer from '../models/Farmer.js';

// Get all payments
export const getAllPayments = async (req, res) => {
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
export const getPaymentById = async (req, res) => {
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
export const getPendingPayments = async (req, res) => {
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
export const getPaymentsByFarmer = async (req, res) => {
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
export const createPayment = async (req, res) => {
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
    
    // Derive amount from new schema (quantity * paymentAmount)
    const amount = (collection.totalValue != null ? collection.totalValue : (collection.quantity || 0) * (collection.paymentAmount || 0));

    const payment = await Payment.create({
      collectionId,
      farmerId: collection.farmer._id,
      farmerName: `${collection.farmer.firstName} ${collection.farmer.lastName}`,
      amount,
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
    
    // Re-fetch updated collection (with virtuals)
    const updatedCollection = await MilkCollection.findById(collection._id);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { payment, collection: updatedCollection }
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
export const updatePayment = async (req, res) => {
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
export const deletePayment = async (req, res) => {
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
export const getPaymentStats = async (req, res) => {
  try {
    const totalPaid = await Payment.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalPending = await MilkCollection.aggregate([
      { $match: { paymentStatus: 'Pending', status: { $ne: 'Rejected' } } },
      { $addFields: { computedTotal: { $multiply: ['$quantity', { $ifNull: ['$paymentAmount', 0] }] } } },
      { $group: { _id: null, total: { $sum: '$computedTotal' } } }
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
