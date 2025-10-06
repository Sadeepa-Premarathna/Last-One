import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  Button,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  ArrowBack,
  LocalShipping,
  Security,
  Nature,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, clearCart, loadCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Enforce minimum quantity of 1, do nothing for decrease below 1
      return;
    }
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      setSnackbarMessage((error as Error).message || 'Failed to update quantity');
      setSnackbarOpen(true);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id);
    } catch (error) {
      setSnackbarMessage((error as Error).message || 'Failed to remove item');
      setSnackbarOpen(true);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      setSnackbarMessage((error as Error).message || 'Failed to clear cart');
      setSnackbarOpen(true);
    }
  };

  const shippingCost = state.totalPrice > 50 ? 0 : 5.99;
  const tax = state.totalPrice * 0.08;
  const finalTotal = state.totalPrice + shippingCost + tax;

  // Reload cart if error
  React.useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        loadCart();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.error, loadCart]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (state.loading && state.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mt: 4 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading cart...</Typography>
      </Container>
    );
  }

  if (state.error && state.items.length > 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
        <Button variant="contained" onClick={loadCart}>
          Retry
        </Button>
      </Container>
    );
  }

  if (state.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  mb: 3,
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                }}
              >
                <ShoppingCartCheckout sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Your Cart is Empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Looks like you haven't added any dairy products to your cart yet.
                Start shopping and discover our fresh, organic dairy collection!
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                component={Link}
                to="/products"
                size="large"
                startIcon={<ArrowBack />}
                sx={{
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                  px: 4,
                  py: 1.5,
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Shopping Cart
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {state.totalItems} item{state.totalItems !== 1 ? 's' : ''} in your cart
            </Typography>
          </Box>

          {state.loading && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 1 }}>Updating cart...</Typography>
            </Box>
          )}

          {state.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {state.error}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <AnimatePresence>
                  {state.items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          {/* Product Image */}
                          <Grid item xs={12} sm={3}>
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 2,
                              }}
                            />
                          </Grid>

                          {/* Product Details */}
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.brand}
                            </Typography>
                            <Chip
                              label={`per ${item.unit}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Grid>

                          {/* Quantity Controls */}
                          <Grid item xs={12} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                size="small"
                                disabled={item.quantity <= 1 || state.loading}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': { borderColor: 'primary.main' },
                                  '&.Mui-disabled': {
                                    borderColor: 'grey.300',
                                    color: 'grey.400',
                                  },
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ minWidth: 40, textAlign: 'center' }}
                              >
                                {item.quantity}
                              </Typography>
                              
                              <IconButton
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                size="small"
                                disabled={state.loading}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  '&:hover': { borderColor: 'primary.main' },
                                  '&.Mui-disabled': {
                                    borderColor: 'grey.300',
                                    color: 'grey.400',
                                  },
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>

                          {/* Price and Remove */}
                          <Grid item xs={12} sm={2}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" fontWeight={600} color="primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveItem(item._id)}
                                color="error"
                                size="small"
                                disabled={state.loading}
                                sx={{ mt: 1 }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Cart Actions */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/products"
                    startIcon={<ArrowBack />}
                    disabled={state.loading}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearCart}
                    startIcon={<Delete />}
                    disabled={state.loading}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </Stack>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  position: 'sticky',
                  top: 100,
                }}
              >
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Order Summary
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal</Typography>
                    <Typography fontWeight={600}>${state.totalPrice.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Shipping</Typography>
                    <Typography fontWeight={600}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax</Typography>
                    <Typography fontWeight={600}>${tax.toFixed(2)}</Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={600}>Total</Typography>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                
                {state.totalPrice < 50 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="body2" color="info.contrastText">
                      Add ${(50 - state.totalPrice).toFixed(2)} more to get FREE shipping!
                    </Typography>
                  </Box>
                )}
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCartCheckout />}
                  onClick={() => navigate('/checkout')}
                  disabled={state.loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                      boxShadow: '0 12px 35px rgba(46, 125, 50, 0.4)',
                    },
                    '&.Mui-disabled': {
                      background: 'grey.400',
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                {/* Trust Badges */}
                <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
                  <Chip
                    icon={<LocalShipping />}
                    label="Fast Delivery"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<Security />}
                    label="Secure"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<Nature />}
                    label="Organic"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;