import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from '../../components/ProductCard/ProductCard';

// Placeholder data for featured products
const featuredProducts = [
  {
    _id: '1',
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows',
    price: 4.99,
    category: 'milk' as const,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    stock: 50,
    unit: 'liter',
    brand: 'FreshFarm',
    expiryDays: 7,
    isOrganic: true,
    fatContent: 3.5,
    volume: 1000,
    rating: 4.8,
    numReviews: 124,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    name: 'Artisan Cheddar Cheese',
    description: 'Aged artisan cheddar cheese with rich flavor',
    price: 12.99,
    category: 'cheese' as const,
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    stock: 25,
    unit: 'kg',
    brand: 'CheeseWorks',
    expiryDays: 30,
    isOrganic: false,
    volume: 500,
    rating: 4.6,
    numReviews: 89,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '3',
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt packed with protein',
    price: 3.99,
    category: 'yogurt' as const,
    image: 'https://images.unsplash.com/photo-1571212059353-05d1e2c5c8b5?w=400',
    stock: 40,
    unit: 'pack',
    brand: 'GreekGold',
    expiryDays: 14,
    isOrganic: true,
    volume: 500,
    rating: 4.7,
    numReviews: 156,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '4',
    name: 'Fresh Butter',
    description: 'Premium unsalted butter made from cream',
    price: 6.99,
    category: 'butter' as const,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    stock: 30,
    unit: 'pack',
    brand: 'CreamyDelight',
    expiryDays: 21,
    isOrganic: false,
    volume: 250,
    rating: 4.5,
    numReviews: 78,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [productsRef, productsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.dark',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Welcome to
                    <Typography
                      component="span"
                      variant="h2"
                      sx={{
                        color: 'secondary.main',
                        display: 'block',
                        fontSize: { xs: '2rem', md: '3rem' },
                      }}
                    >
                      Dairy Licious
                    </Typography>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      color: 'text.secondary',
                      maxWidth: 500,
                    }}
                  >
                    Discover the finest selection of premium natural dairy products 
                    sourced directly from trusted farms. Quality you can taste, 
                    freshness that delights your senses.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/products"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/about"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src = "https://domf5oio6qrcr.cloudfront.net/medialibrary/9685/iStock-544807136.jpg"
                  alt="Dairy Licious Products"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FFC107, #FF9800)',
            opacity: 0.1,
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
            opacity: 0.1,
            animation: 'float 4s ease-in-out infinite reverse',
          }}
        />
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          ref={productsRef}
          initial="hidden"
          animate={productsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'primary.dark' }}
              >
                Featured Products
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Handpicked selection of our finest Dairy Licious products
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {featuredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
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

          <motion.div variants={fadeInUp}>
            <Box textAlign="center" mt={6}>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/products"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                }}
              >
                View All Products
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default Home;
