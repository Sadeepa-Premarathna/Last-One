import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Receipt,
  Home,
  Phone,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface OrderConfirmationProps {
  orderDetails: any;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderDetails }) => {
  const navigate = useNavigate();

  if (!orderDetails) {
    return (
      <Alert severity="error">
        Order details not found. Please try again.
      </Alert>
    );
  }

  const handleTrackOrder = () => {
    navigate(`/orders/track/${orderDetails.trackingNumber}`);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckCircle
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
        </motion.div>
        
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your order. We'll send you a confirmation email shortly.
        </Typography>
        
        <Paper
          sx={{
            display: 'inline-block',
            px: 3,
            py: 2,
            backgroundColor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.200',
          }}
        >
          <Typography variant="h6" color="primary">
            Order ID: {orderDetails.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tracking: {orderDetails.trackingNumber}
          </Typography>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                Order Summary
              </Typography>
              
              <List>
                {orderDetails.items.map((item: any, index: number) => (
                  <React.Fragment key={`${item._id}-${index}`}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.brand} • Qty: ${item.quantity}`}
                      />
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    {index < orderDetails.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${(orderDetails.totalAmount - orderDetails.deliveryFee).toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>${orderDetails.deliveryFee.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${orderDetails.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                Delivery Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<Schedule />}
                  label={`Estimated delivery: ${new Date(orderDetails.estimatedDelivery).toLocaleDateString()}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                <Home sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                Delivery Address:
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                {orderDetails.address.fullName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {orderDetails.address.addressLine1}
              </Typography>
              {orderDetails.address.addressLine2 && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {orderDetails.address.addressLine2}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipCode}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                {orderDetails.address.phone}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              
              <Typography variant="body1">
                {orderDetails.paymentMethod.title}
              </Typography>
              
              {orderDetails.paymentMethod.type === 'cash' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Please keep ${orderDetails.totalAmount.toFixed(2)} ready for cash on delivery
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleTrackOrder}
                sx={{
                  minWidth: 180,
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                  },
                }}
              >
                Track Your Order
              </Button>
            </motion.div>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              onClick={handleContinueShopping}
              sx={{ minWidth: 180 }}
            >
              Continue Shopping
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Order Status Timeline */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          What's Next?
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Order Confirmed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your order has been placed successfully
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Preparing Order
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're gathering your fresh products
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalShipping color="action" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Out for Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your order will be delivered soon
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default OrderConfirmation;
