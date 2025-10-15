const express = require('express');
const router = express.Router();
const mockDataService = require('../services/mockDataService');

// Helper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Drivers routes
router.get('/drivers', asyncHandler(async (req, res) => {
  const result = await mockDataService.getDrivers(req.query);
  res.json(result);
}));

router.get('/drivers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.getDriverById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.post('/drivers', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.createDriver(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

router.put('/drivers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.updateDriver(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.delete('/drivers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.deleteDriver(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

// Farmers routes
router.get('/farmers', asyncHandler(async (req, res) => {
  const result = await mockDataService.getFarmers(req.query);
  res.json(result);
}));

router.get('/farmers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.getFarmerById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.post('/farmers', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.createFarmer(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

router.put('/farmers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.updateFarmer(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.delete('/farmers/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.deleteFarmer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

// Milk Collections routes
router.get('/milk-collections', asyncHandler(async (req, res) => {
  const result = await mockDataService.getMilkCollections(req.query);
  res.json(result);
}));

router.get('/milk-collections/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.getMilkCollectionById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.post('/milk-collections', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.createMilkCollection(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

router.put('/milk-collections/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.updateMilkCollection(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.delete('/milk-collections/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.deleteMilkCollection(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

// Payments routes
router.get('/payments', asyncHandler(async (req, res) => {
  const result = await mockDataService.getPayments(req.query);
  res.json(result);
}));

router.get('/payments/stats', asyncHandler(async (req, res) => {
  const result = await mockDataService.getPaymentStats();
  res.json(result);
}));

router.get('/payments/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.getPaymentById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

router.post('/payments', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.createPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}));

// Orders routes
router.get('/orders', asyncHandler(async (req, res) => {
  const result = await mockDataService.getOrders(req.query);
  res.json(result);
}));

router.get('/orders/:id', asyncHandler(async (req, res) => {
  try {
    const result = await mockDataService.getOrderById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}));

// Deliveries routes
router.get('/deliveries', asyncHandler(async (req, res) => {
  const result = await mockDataService.getDeliveries(req.query);
  res.json(result);
}));

// Catch all - return appropriate error for unmatched routes
router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found in mock data service`
  });
});

module.exports = router;