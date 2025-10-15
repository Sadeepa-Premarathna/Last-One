import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaStar, FaFilter, FaSearch, FaBox, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Product } from '../Inventorytypes/inventoryTypes';
import { productService } from '../Inventoryservices/inventoryApi';
import './InventoryShop.css';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
    // Auto-refresh every 30 seconds to get latest stock
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      // Only show active products with stock
      const availableProducts = data.filter((p: Product) => 
        p.status === 'active' && p.stock > 0
      );
      setProducts(availableProducts);
      setFilteredProducts(availableProducts);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', 'Milk', 'Yogurt', 'Cheese', 'Butter', 'Ice Cream', 'Cream', 'Other'];

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (quantity <= minStock) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  const addToCart = (productId: string, maxQuantity: number) => {
    const currentQty = cart[productId] || 0;
    if (currentQty < maxQuantity) {
      setCart(prev => ({ ...prev, [productId]: currentQty + 1 }));
      toast.success('Added to cart!', { autoClose: 1000 });
    } else {
      toast.warning('Maximum stock reached!');
    }
  };

  const removeFromCart = (productId: string) => {
    const currentQty = cart[productId] || 0;
    if (currentQty > 0) {
      setCart(prev => ({ ...prev, [productId]: currentQty - 1 }));
      toast.info('Removed from cart', { autoClose: 1000 });
    }
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p._id === productId);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `Rs ${price.toFixed(2)}`;
  };

  return (
    <div className="shop-page">
      <motion.div
        className="shop-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="shop-header-content">
          <div className="shop-title">
            <FaShoppingCart className="shop-icon" />
            <div>
              <h1>Dairy Licious Shop</h1>
              <p>Fresh dairy products with live stock updates</p>
            </div>
          </div>
          <div className="cart-summary">
            <div className="cart-icon-wrapper">
              <FaShoppingCart />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </div>
            <div className="cart-details">
              <span className="cart-items">{getTotalItems()} items</span>
              <span className="cart-total">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>

        <div className="shop-controls">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <FaFilter />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button className="refresh-btn" onClick={fetchProducts}>
            <FaBox /> Refresh Stock
          </button>
        </div>
      </motion.div>

      <div className="stock-info-banner">
        <FaInfoCircle />
        <span>Stock levels update in real-time. Prices shown in Sri Lankan Rupees (Rs)</span>
      </div>

      {loading ? (
        <div className="shop-loading">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          className="empty-shop"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon">📦</div>
          <h2>No Products Available</h2>
          <p>
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your filters'
              : 'Check back later for fresh products'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="shop-products-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock, product.minStockLevel);
            const cartQty = cart[product._id] || 0;

            return (
              <motion.div
                key={product._id}
                className="shop-product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="product-image-wrapper">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="product-image-placeholder" 
                    style={{ display: product.image ? 'none' : 'flex' }}
                  >
                    <FaBox />
                  </div>
                  <span className={`stock-badge ${stockStatus.class}`}>
                    {stockStatus.label}
                  </span>
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    {product.featured && <span className="featured-badge">⭐ Featured</span>}
                  </div>
                  <div className="product-brand">{product.brand}</div>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    {product.isOrganic && <span className="organic-badge">🌿 Organic</span>}
                    {product.fatContent && (
                      <span className="product-detail">Fat: {product.fatContent}%</span>
                    )}
                  </div>

                  <div className="stock-details">
                    <div className="stock-item">
                      <span className="label">Available:</span>
                      <span className="value">{product.stock} {product.unit}</span>
                    </div>
                    <div className="stock-item">
                      <span className="label">Price:</span>
                      <span className="value price">{formatPrice(product.price)}</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    {cartQty > 0 ? (
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => removeFromCart(product._id)}
                        >
                          -
                        </button>
                        <span className="qty-display">{cartQty}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => addToCart(product._id, product.stock)}
                          disabled={cartQty >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product._id, product.stock)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShoppingCart /> Add to Cart
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Shop;
