import express from 'express';
const router = express.Router();
import {
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
} from '../controllers/deliveryController.js';

// Milk collection delivery routes
router.route('/milk-collection')
  .post(createMilkCollectionDelivery)
  .get(getMilkCollectionDeliveries);

router.route('/milk-collection/:id/status')
  .patch(updateMilkCollectionDeliveryStatus);

router.route('/')
  .get(getDeliveries)
  .post(createDelivery);

router.route('/date-range')
  .get(getDeliveriesByDateRange);

router.route('/status/:status')
  .get(getDeliveriesByStatus);

router.route('/driver/:driverId')
  .get(getDeliveriesByDriver);

router.route('/:id')
  .get(getDelivery)
  .put(updateDelivery)
  .delete(deleteDelivery);

export default router;
