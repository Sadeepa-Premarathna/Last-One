const express = require('express');
const router = express.Router();
const {
  getMilkCollections,
  getMilkCollection,
  createMilkCollection,
  updateMilkCollection,
  deleteMilkCollection,
  getCollectionsByFarmer,
  getCollectionsByDateRange
} = require('../controllers/milkCollectionController');

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

module.exports = router;
