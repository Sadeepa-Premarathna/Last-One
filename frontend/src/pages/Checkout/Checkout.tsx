import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import AddressStep from '../../components/Checkout/AddressStep';
import PaymentStep from '../../components/Checkout/PaymentStep';
import OrderSummary from '../../components/Checkout/OrderSummary';
import OrderConfirmation from '../../components/Checkout/OrderConfirmation';
import toast from 'react-hot-toast';

export interface Address {
  id?: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'digital_wallet';
  title: string;
  details?: string;
  icon?: string;
}

const steps = ['Cart Review', 'Delivery Address', 'Payment Method', 'Order Confirmation'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const items = state.items;
  const totalPrice = state.totalPrice;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0 && activeStep === 0) {
      navigate('/cart');
    }
  }, [items, activeStep, navigate]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Already on confirmation, no action
      return;
    } else if (activeStep === steps.length - 2) {
      // On payment step, place order
      await handlePlaceOrder();
    } else {
      // Validate before advancing
      if (canProceed()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setOrderError(null); // Clear any previous errors
      } else {
        toast.error('Please complete the current step');
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setOrderError(null);
  };

  // Map frontend payment to backend enum
  const mapPaymentMethod = (pmId: string): string => {
    switch (pmId) {
      case 'card': return 'credit_card';
      case 'cash': return 'cash_on_delivery';
      case 'digital_wallet': return 'upi';
      default: return 'cash_on_delivery';
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment || items.length === 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    setOrderError(null);
    
    try {
      console.log('Placing order with items:', items);
      console.log('Selected address:', selectedAddress);
      console.log('Selected payment:', selectedPayment);

      // Map address to backend format
      const backendAddress = {
        street: selectedAddress.addressLine1,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country,
      };

      const requestBody = {
        shippingAddress: backendAddress,
        paymentMethod: mapPaymentMethod(selectedPayment.id),
        items: items.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // For session-based guest ID
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok || !data.success || !data.data) {
        const errorMsg = data.message || `HTTP error! status: ${response.status}. Response: ${JSON.stringify(data)}`;
        throw new Error(errorMsg);
      }

      console.log('Order created successfully, data.data:', data.data);

      // Map response to frontend orderDetails
      // Updated: Use orderNumber as the primary 'id' for display as Order ID
      const mappedDetails = {
        id: data.data.orderNumber, // Now uses the sequential orderNumber (e.g., ORD000001) as the main ID
        orderNumber: data.data.orderNumber,
        items: (data.data.items || []).map((item: any) => ({
          ...item,
          brand: item.brand || 'DairyLicious', // Fallback
          _id: item.productId || item._id, // Ensure _id for key
        })),
        subtotal: data.data.totalAmount || 0,
        deliveryFee: data.data.shippingCost || 0,
        taxAmount: data.data.taxAmount || 0,
        totalAmount: (data.data.totalAmount || 0) + (data.data.shippingCost || 0) + (data.data.taxAmount || 0),
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
        paymentMethod: selectedPayment, // Keep frontend object for rendering
        orderDate: data.data.createdAt || new Date().toISOString(),
        estimatedDelivery: data.data.deliveryDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: data.data.orderStatus || 'pending',
        trackingNumber: data.data.orderNumber, // Also uses orderNumber for tracking
      };

      console.log('Mapped order details:', mappedDetails);

      setOrderDetails(mappedDetails);

      // Clear cart after success
      clearCart();

      // Only advance if details are set
      if (mappedDetails.id && mappedDetails.items.length > 0) {
        setActiveStep(steps.length - 1);
        toast.success('Order placed successfully!');
      } else {
        throw new Error('Invalid order data returned from server');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      const errorMessage = (error as Error).message || 'Failed to place order. Please try again.';
      setOrderError(errorMessage);
      toast.error(`Order failed: ${errorMessage}`);
      // Stay on payment step on error
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return items.length > 0;
      case 1:
        return !!selectedAddress;
      case 2:
        return !!selectedPayment && !orderError; // Don't proceed if error
      default:
        return true;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Summary ({items.length} items)
                    </Typography>
                    <List>
                      {items.map((item, index) => (
                        <React.Fragment key={`${item._id}-${index}`}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                src={item.image}
                                alt={item.name}
                                sx={{ width: 60, height: 60 }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.name}
                              secondary={`${item.brand || 'DairyLicious'} • ${item.unit || 'unit'}`}
                              sx={{ ml: 2 }}
                            />
                            <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </ListItem>
                          {index < items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <OrderSummary />
              </Grid>
            </Grid>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddressStep
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <PaymentStep
                  selectedPayment={selectedPayment}
                  onPaymentSelect={setSelectedPayment}
                  totalAmount={totalPrice + (totalPrice > 50 ? 0 : 5.99)}
                />
                {orderError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {orderError}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Delivery Address
                    </Typography>
                    {selectedAddress && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {selectedAddress.fullName}
                        </Typography>
                        <Typography variant="body2">
                          {selectedAddress.addressLine1}
                        </Typography>
                        {selectedAddress.addressLine2 && (
                          <Typography variant="body2">
                            {selectedAddress.addressLine2}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </Typography>
                        <Typography variant="body2">
                          {selectedAddress.phone}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <OrderSummary />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        );
      case 3:
        return orderDetails ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OrderConfirmation orderDetails={orderDetails} />
          </motion.div>
        ) : (
          <div>
            <Alert severity="error">
              Order details not found. Please try again.
            </Alert>
            <Button onClick={handleBack} variant="contained" sx={{ mt: 2 }}>
              Go Back to Payment
            </Button>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0 && activeStep !== steps.length - 1) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add items to proceed with checkout.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Checkout
        </Typography>
      </motion.div>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Stepper
          activeStep={activeStep}
          sx={{ mb: 4 }}
          alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={
                  index === 0 ? <ShoppingCart /> :
                  index === 1 ? <LocationOn /> :
                  index === 2 ? <Payment /> :
                  <CheckCircle />
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography align="center" sx={{ mt: 1 }}>
              Processing your order...
            </Typography>
          </Box>
        )}

        <AnimatePresence mode="wait">
          <Box sx={{ minHeight: 400 }}>
            {getStepContent(activeStep)}
          </Box>
        </AnimatePresence>

        {activeStep !== steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed() || loading}
                size="large"
                sx={{
                  minWidth: 120,
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                  },
                }}
              >
                {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
              </Button>
            </motion.div>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;