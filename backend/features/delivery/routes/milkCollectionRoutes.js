import express from 'express';
const router = express.Router();
import {
  getMilkCollections,
  getMilkCollection,
  createMilkCollection,
  updateMilkCollection,
  deleteMilkCollection,
  getCollectionsByFarmer,
  getCollectionsByDateRange
} from '../controllers/milkCollectionController.js';

router.route('/')
  .get(getMilkCollections)
  .post(createMilkCollection);

router.route('/date-range')
  .get(getCollectionsByDateRange);

router.route('/farmer/:farmerId')
  .get(getCollectionsByFarmer);

router.route('/:id')
  .get(getMilkCollection)
  .put(updateMilkCollection)
  .delete(deleteMilkCollection);

export default router;
