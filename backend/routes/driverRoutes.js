const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getActiveDrivers
} = require('../controllers/driverController');

router.route('/')
  .get(getDrivers)
  .post(createDriver);

router.route('/status/active')
  .get(getActiveDrivers);

router.route('/:id')
  .get(getDriver)
  .put(updateDriver)
  .delete(deleteDriver);

module.exports = router;
