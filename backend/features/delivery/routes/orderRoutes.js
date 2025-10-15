import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController.js';

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

export default router;
