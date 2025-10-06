const InventoryProduct = require('../Inventorymodels/InventoryProduct');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await InventoryProduct.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await InventoryProduct.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = await InventoryProduct.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // Handle duplicate batch number error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Batch number already exists. Please use a unique batch number.',
        error: 'Duplicate batch number'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    // Remove batchNumber from update data as it's unique and immutable
    const updateData = { ...req.body };
    delete updateData.batchNumber;
    
    // Validate expiry days
    if (updateData.expiryDays && updateData.expiryDays < 1) {
      res.status(400).json({
        success: false,
        message: 'Expiry days must be at least 1'
      });
      return;
    }
    
    const product = await InventoryProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({
        success: false,
        message: messages.join(', '),
        error: 'Validation Error'
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await InventoryProduct.findByIdAndDelete(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get expiring products (within 7 days)
const getExpiringProducts = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    // Get all products and calculate expiry date
    const allProducts = await InventoryProduct.find({ status: { $ne: 'expired' } });
    
    const expiringProducts = allProducts.filter(product => {
      const expiryDate = new Date(product.manufactureDate);
      expiryDate.setDate(expiryDate.getDate() + product.expiryDays);
      return expiryDate >= now && expiryDate <= sevenDaysFromNow;
    }).sort((a, b) => {
      const dateA = new Date(a.manufactureDate);
      dateA.setDate(dateA.getDate() + a.expiryDays);
      const dateB = new Date(b.manufactureDate);
      dateB.setDate(dateB.getDate() + b.expiryDays);
      return dateA.getTime() - dateB.getTime();
    });
    
    res.status(200).json({
      success: true,
      count: expiringProducts.length,
      data: expiringProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring products',
      error: error.message
    });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await InventoryProduct.find({
      status: { $in: ['low-stock', 'out-of-stock'] }
    }).sort({ stock: 1 });
    
    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await InventoryProduct.countDocuments();
    const activeProducts = await InventoryProduct.countDocuments({ status: 'active' });
    const lowStockProducts = await InventoryProduct.countDocuments({ status: 'low-stock' });
    const expiredProducts = await InventoryProduct.countDocuments({ status: 'expired' });
    
    const totalValue = await InventoryProduct.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        expiredProducts,
        totalInventoryValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getExpiringProducts,
  getLowStockProducts,
  getDashboardStats
};