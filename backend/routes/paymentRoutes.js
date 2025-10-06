const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get pending payments (unpaid collections)
router.get('/pending', paymentController.getPendingPayments);

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats);

// Get payments by farmer
router.get('/farmer/:farmerId', paymentController.getPaymentsByFarmer);

// Get single payment
router.get('/:id', paymentController.getPaymentById);

// Create payment
router.post('/', paymentController.createPayment);

// Update payment
router.patch('/:id', paymentController.updatePayment);

// Delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
