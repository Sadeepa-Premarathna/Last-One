import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  GridView,
  ViewList,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types';

const Products: React.FC = () => {
  const navigate = useNavigate();
  
  // State for database products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showOrganic, setShowOrganic] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Categories for the dropdown
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'milk', label: 'Milk' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'yogurt', label: 'Yogurt' },
    { value: 'butter', label: 'Butter' },
    { value: 'cream', label: 'Cream' },
    { value: 'ice-cream', label: 'Ice Cream' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'featured', label: 'Featured First' },
  ];

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching products from:', 'http://localhost:5000/api/products');
      
      const response = await fetch('http://localhost:5000/api/products');
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Received data:', data);
      
      // Handle the actual response structure from backend
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('✅ Found', data.data.length, 'products');
        setProducts(data.data);
      } else {
        console.error('❌ Unexpected response structure:', data);
        throw new Error('Invalid response structure from server');
      }
    } catch (err: any) {
      console.error('❌ Error fetching products:', err);
      setError(err.message || 'Failed to load products from database');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Retry function
  const handleRetry = () => {
    fetchProducts();
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products; // Use real products from database

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by organic
    if (showOrganic) {
      filtered = filtered.filter((product) => product.isOrganic);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
          return Number(b.featured) - Number(a.featured);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, showOrganic]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', pt: 4, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} color="primary" />
              <Typography variant="h6" color="text.secondary">
                Loading fresh dairy products from database...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ mb: 4 }}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleRetry} startIcon={<Refresh />}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Please ensure the backend server is running on port 5000 and the database is connected.
            </Typography>
          </Box>
        )}

        {/* Main Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: 'primary.dark',
                    mb: 2,
                  }}
                >
                  Our Fresh Dairy Products
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}
                >
                  Discover our premium selection of fresh dairy products from database
                </Typography>
                <Chip 
                  label={`${products.length} Products Available`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
            </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <Tabs
                  value={selectedCategory}
                  onChange={(_, value) => setSelectedCategory(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ minHeight: 'auto' }}
                >
                  {categories.map((category) => (
                    <Tab
                      key={category.value}
                      label={category.label}
                      value={category.value}
                      sx={{
                        minHeight: 'auto',
                        py: 1,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                      }}
                    />
                  ))}
                </Tabs>
              </Grid>

              {/* Sort */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Filters */}
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant={showOrganic ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setShowOrganic(!showOrganic)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Organic Only
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('grid')}
                      sx={{ minWidth: 40 }}
                    >
                      <GridView />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('list')}
                      sx={{ minWidth: 40 }}
                    >
                      <ViewList />
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
            </Typography>
            
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : filteredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={viewMode === 'grid' ? 4 : 6}
                  lg={viewMode === 'grid' ? 3 : 4}
                  key={product._id}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={(id) => console.log('Add to cart:', id)}
                      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
                      onProductClick={handleProductClick}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOrganic(false);
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Paper>
          )}
        </motion.div>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;
