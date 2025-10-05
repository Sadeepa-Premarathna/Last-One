import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  ButtonGroup,
  Chip,
  Paper,
  Stack,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Note as NoteIcon,
  ShoppingCart as CartIcon,
  Payment as CheckoutIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MiniCartSidebar: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const navigate = useNavigate();
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Debug: Log the cart state
  console.log('MiniCartSidebar - Cart State:', {
    isOpen: state.isOpen,
    itemCount: state.items.length,
    totalItems: state.totalItems
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleSaveNote = () => {
    setShowNoteInput(false);
    console.log('Order note saved:', orderNote);
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setOrderNote('');
  };

  return (
    <Drawer
      anchor="right"
      open={state.isOpen}
      onClose={closeCart}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Items added to your cart
          </Typography>
          <IconButton onClick={closeCart} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {state.items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60%',
                textAlign: 'center',
              }}
            >
              <CartIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some delicious dairy products!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {state.items.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card variant="outlined" sx={{ overflow: 'visible' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* Product Image */}
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          />
                          
                          {/* Product Details */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                              noWrap
                            >
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.brand}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                            
                            {/* Quantity Controls */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 1,
                              }}
                            >
                              <ButtonGroup size="small" variant="outlined">
                                <IconButton
                                  onClick={() =>
                                    handleQuantityChange(item._id, item.quantity - 1)
                                  }
                                  size="small"
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Button
                                  sx={{
                                    minWidth: 40,
                                    fontWeight: 600,
                                    cursor: 'default',
                                    '&:hover': { backgroundColor: 'transparent' },
                                  }}
                                  disableRipple
                                >
                                  {item.quantity}
                                </Button>
                                <IconButton
                                  onClick={() =>
                                    handleQuantityChange(item._id, item.quantity + 1)
                                  }
                                  size="small"
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </ButtonGroup>
                              
                              {/* Price Info */}
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary">
                                  ${item.price.toFixed(2)} / {item.unit}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Delete Button */}
                          <IconButton
                            onClick={() => removeItem(item._id)}
                            size="small"
                            sx={{
                              color: 'error.main',
                              '&:hover': { backgroundColor: 'error.light', color: 'white' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          )}
        </Box>

        {/* Bottom Section */}
        {state.items.length > 0 && (
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderTop: 1,
              borderColor: 'divider',
              borderRadius: 0,
            }}
          >
            {/* Add Note Section */}
            <Box sx={{ mb: 3 }}>
              {!showNoteInput ? (
                <Button
                  startIcon={<NoteIcon />}
                  onClick={() => setShowNoteInput(true)}
                  variant="text"
                  size="small"
                  sx={{ mb: 1 }}
                >
                  Add Note
                </Button>
              ) : (
                <Box>
                  <TextField
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Order special instructions"
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={handleSaveNote}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelNote}
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Subtotal */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SUBTOTAL:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${state.totalPrice.toFixed(2)}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                onClick={handleViewCart}
                variant="outlined"
                size="large"
                startIcon={<CartIcon />}
                fullWidth
                sx={{ fontWeight: 600 }}
              >
                View Cart
              </Button>
              <Button
                onClick={handleCheckout}
                variant="contained"
                size="large"
                startIcon={<CheckoutIcon />}
                fullWidth
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                  },
                }}
              >
                Checkout
              </Button>
              <Alert severity="info" sx={{ textAlign: 'center' }}>
                <Typography variant="caption">
                  Taxes and shipping calculated at checkout
                </Typography>
              </Alert>
            </Stack>
          </Paper>
        )}
      </Box>
    </Drawer>
  );
};

export default MiniCartSidebar;