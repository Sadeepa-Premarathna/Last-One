import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error: any) {
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
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
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
    
    const product = await Product.findByIdAndUpdate(
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
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
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
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get expiring products (within 7 days)
export const getExpiringProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    // Get all products and calculate expiry date
    const allProducts = await Product.find({ status: { $ne: 'expired' } });
    
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring products',
      error: error.message
    });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const lowStockProducts = await Product.find({
      status: { $in: ['low-stock', 'out-of-stock'] }
    }).sort({ stock: 1 });
    
    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.countDocuments({ status: 'low-stock' });
    const expiredProducts = await Product.countDocuments({ status: 'expired' });
    
    const totalValue = await Product.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
