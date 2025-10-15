import express from 'express';
const router = express.Router();
import {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getActiveDrivers
} from '../controllers/driverController.js';

router.route('/')
  .get(getDrivers)
  .post(createDriver);

router.route('/status/active')
  .get(getActiveDrivers);

router.route('/:id')
  .get(getDriver)
  .put(updateDriver)
  .delete(deleteDriver);

export default router;
