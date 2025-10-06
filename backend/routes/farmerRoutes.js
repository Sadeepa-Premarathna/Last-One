const express = require('express');
const router = express.Router();
const {
  getFarmers,
  getFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer,
  getActiveFarmers
} = require('../controllers/farmerController');

router.route('/')
  .get(getFarmers)
  .post(createFarmer);

router.route('/status/active')
  .get(getActiveFarmers);

router.route('/:id')
  .get(getFarmer)
  .put(updateFarmer)
  .delete(deleteFarmer);

module.exports = router;
