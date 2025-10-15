import express from 'express';
import {
  getAllMilkCollections,
  getMilkCollectionById,
  getMilkCollectionStats,
  createMilkCollection,
  updateMilkCollection,
  deleteMilkCollection
} from '../Inventorycontrollers/inventoryMilkCollectionController.js';

const router = express.Router();

// Statistics route
router.get('/stats', getMilkCollectionStats);

// CRUD routes
router.get('/', getAllMilkCollections);
router.get('/:id', getMilkCollectionById);
router.post('/', createMilkCollection);
router.put('/:id', updateMilkCollection);
router.delete('/:id', deleteMilkCollection);

export default router;