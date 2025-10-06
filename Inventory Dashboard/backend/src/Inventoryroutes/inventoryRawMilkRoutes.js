const express = require('express');
const {
  getAllRawMilk,
  getRawMilkById,
  createRawMilk,
  updateRawMilk,
  deleteRawMilk,
  getRawMilkStats
} = require('../Inventorycontrollers/inventoryRawMilkController');

const router = express.Router();

router.get('/stats', getRawMilkStats);
router.get('/', getAllRawMilk);
router.get('/:id', getRawMilkById);
router.post('/', createRawMilk);
router.put('/:id', updateRawMilk);
router.delete('/:id', deleteRawMilk);

module.exports = router;