const Cart = require('../Model/Cart');
const Product = require('../Model/Product');

// Helper function to get user ID (authenticated user or guest)
const getUserId = (req) => {
  // If user is authenticated, use their ID
  if (req.user && req.user.id) {
    return req.user.id;
  }
  
  // For guest users, create/use a session-based ID
  if (!req.session) {
    req.session = {};
  }
  
  if (!req.session.guestId) {
    req.session.guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return req.session.guestId;
};

// Helper function to calculate total price from items
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    console.log('Getting cart for user:', userId);

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
      await cart.save();
      console.log('Created new cart for user:', userId);
    } else {
      // Ensure totalPrice is up-to-date
      const calculatedTotal = calculateTotalPrice(cart.items);
      if (cart.totalPrice !== calculatedTotal) {
        cart.totalPrice = calculatedTotal;
        await cart.save();
      }
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching cart' 
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity = 1 } = req.body;

    console.log('Adding to cart - UserId:', userId, 'ProductId:', productId, 'Quantity:', quantity);

    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }

    // Verify product exists and get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient stock',
        availableStock: product.stock
      });
    }

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      console.log('Created new cart for userId:', userId);
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          success: false,
          message: 'Cannot add more items than available stock',
          availableStock: product.stock,
          currentInCart: cart.items[existingItemIndex].quantity
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
      console.log('Updated existing item quantity to:', newQuantity);
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
      console.log('Added new item to cart');
    }

    // Update totalPrice
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    await cart.populate('items.product');

    console.log('Cart saved successfully. Total items:', cart.items.length);

    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding to cart' 
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID or quantity' 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      // Check stock availability
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Product not found' 
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          success: false,
          message: 'Insufficient stock',
          availableStock: product.stock
        });
      }

      // Update item quantity
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price;
      } else {
        return res.status(404).json({ 
          success: false,
          message: 'Item not found in cart' 
        });
      }
    }

    // Update totalPrice
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating cart' 
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    // Update totalPrice
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while removing from cart' 
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    console.log('Clearing cart for user:', userId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create empty cart if none exists
      const emptyCart = new Cart({ user: userId, items: [], totalPrice: 0 });
      await emptyCart.save();
      return res.json({
        success: true,
        data: emptyCart,
        message: 'Cart cleared successfully'
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    console.log('Cart cleared successfully for user:', userId);

    res.json({
      success: true,
      data: cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while clearing cart' 
    });
  }
};

// Get cart item count
const getCartItemCount = async (req, res) => {
  try {
    const userId = getUserId(req);

    const cart = await Cart.findOne({ user: userId });
    const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    res.json({ 
      success: true,
      itemCount 
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while getting cart count' 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount
};