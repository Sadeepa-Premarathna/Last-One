import express from 'express';
const router = express.Router();
import {
  getFarmers,
  getFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  getActiveFarmers
} from '../controllers/farmerController.js';

router.route('/')
  .get(getFarmers)
  .post(createFarmer);

router.route('/status/active')
  .get(getActiveFarmers);

router.route('/:id')
  .get(getFarmer)
  .put(updateFarmer)
  .delete(deleteFarmer);

export default router;
