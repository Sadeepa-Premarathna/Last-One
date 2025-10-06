const express = require('express');
const { body, query } = require('express-validator');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Get all products
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ min: 1 }).withMessage('Search term must not be empty'),
  query('category').optional().isIn(['milk', 'yogurt', 'cheese', 'butter', 'cream', 'ice-cream', 'other']).withMessage('Invalid category'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'expiryDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('inStock').optional().isBoolean().withMessage('inStock must be a boolean')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const inStock = req.query.inStock;

    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    
    if (inStock === true) {
      query.stock = { $gt: 0 };
    } else if (inStock === false) {
      query.stock = { $eq: 0 };
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminMiddleware, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Product name must be between 1 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('category').isIn(['milk', 'yogurt', 'cheese', 'butter', 'cream', 'ice-cream', 'other']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit').isIn(['ml', 'l', 'g', 'kg', 'piece']).withMessage('Invalid unit'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minStock').optional().isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
  body('batchNumber').trim().isLength({ min: 1 }).withMessage('Batch number is required')
], handleValidationErrors, async (req, res) => {
  try {
    const productData = req.body;
    
    // Check if batch number already exists
    const existingProduct = await Product.findOne({ batchNumber: productData.batchNumber });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this batch number already exists' });
    }

    // Validate dates
    const manufacturingDate = new Date(productData.manufacturingDate);
    const expiryDate = new Date(productData.expiryDate);
    
    if (expiryDate <= manufacturingDate) {
      return res.status(400).json({ message: 'Expiry date must be after manufacturing date' });
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Product name must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('category').optional().isIn(['milk', 'yogurt', 'cheese', 'butter', 'cream', 'ice-cream', 'other']).withMessage('Invalid category'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('unit').optional().isIn(['ml', 'l', 'g', 'kg', 'piece']).withMessage('Invalid unit'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('minStock').optional().isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  body('brand').optional().trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('expiryDate').optional().isISO8601().withMessage('Valid expiry date is required'),
  body('manufacturingDate').optional().isISO8601().withMessage('Valid manufacturing date is required'),
  body('batchNumber').optional().trim().isLength({ min: 1 }).withMessage('Batch number is required')
], handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if batch number is being changed and already exists
    if (req.body.batchNumber && req.body.batchNumber !== product.batchNumber) {
      const existingProduct = await Product.findOne({ batchNumber: req.body.batchNumber });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this batch number already exists' });
      }
    }

    // Validate dates if both are provided
    const manufacturingDate = req.body.manufacturingDate ? new Date(req.body.manufacturingDate) : product.manufacturingDate;
    const expiryDate = req.body.expiryDate ? new Date(req.body.expiryDate) : product.expiryDate;
    
    if (expiryDate <= manufacturingDate) {
      return res.status(400).json({ message: 'Expiry date must be after manufacturing date' });
    }

    // Update product
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Get product categories
router.get('/meta/categories', (req, res) => {
  const categories = ['milk', 'yogurt', 'cheese', 'butter', 'cream', 'ice-cream', 'other'];
  res.json({ categories });
});

// Get low stock products (admin only)
router.get('/alerts/low-stock', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    }).sort({ stock: 1 });

    res.json({ products });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Server error fetching low stock products' });
  }
});

// Get expired products (admin only)
router.get('/alerts/expired', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      isActive: true,
      expiryDate: { $lt: now }
    }).sort({ expiryDate: 1 });

    res.json({ products });
  } catch (error) {
    console.error('Get expired products error:', error);
    res.status(500).json({ message: 'Server error fetching expired products' });
  }
});

// Get product statistics (admin only)
router.get('/stats/overview', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ isActive: true, stock: 0 });
    const lowStock = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    });
    
    const now = new Date();
    const expired = await Product.countDocuments({
      isActive: true,
      expiryDate: { $lt: now }
    });

    // Category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      statistics: {
        totalProducts,
        outOfStock,
        lowStock,
        expired,
        categoryDistribution: categoryStats
      }
    });
  } catch (error) {
    console.error('Get product statistics error:', error);
    res.status(500).json({ message: 'Server error fetching product statistics' });
  }
});

module.exports = router;