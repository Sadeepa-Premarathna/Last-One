const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get single order
router.get('/:id', orderController.getOrderById);

// Assign driver to order
router.patch('/:id/assign-driver', orderController.assignDriver);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Update payment status
router.patch('/:id/payment', orderController.updatePaymentStatus);

// Delete order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
