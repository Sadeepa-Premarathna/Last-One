import express from 'express';
import {
  getAllRawMilk,
  getRawMilkById,
  createRawMilk,
  updateRawMilk,
  deleteRawMilk,
  getRawMilkStats
} from '../Inventorycontrollers/inventoryRawMilkController.js';

const router = express.Router();

router.get('/stats', getRawMilkStats);
router.get('/', getAllRawMilk);
router.get('/:id', getRawMilkById);
router.post('/', createRawMilk);
router.put('/:id', updateRawMilk);
router.delete('/:id', deleteRawMilk);

export default router;