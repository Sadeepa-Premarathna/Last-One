const express = require('express');
const router = express.Router();
const {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveriesByStatus,
  getDeliveriesByDriver,
  getDeliveriesByDateRange
} = require('../controllers/deliveryController');

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

module.exports = router;
