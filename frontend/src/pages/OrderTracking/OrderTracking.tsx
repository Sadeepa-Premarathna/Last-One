import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  LocalShipping,
  Inventory,
  Restaurant,
  ArrowBack,
  LocationOn,
  Schedule,
  Phone,
  WhatsApp,
  Email,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TrackingStep {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

interface OrderTrackingData {
  orderId: string;
  trackingNumber: string;
  status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  currentLocation?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    photo: string;
  };
  items: any[];
  totalAmount: number;
  address: any;
}

const OrderTracking: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock order data
      const mockData: OrderTrackingData = {
        orderId: 'ORD-' + Date.now(),
        trackingNumber: trackingNumber || 'TRK123456789',
        status: 'out_for_delivery',
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        currentLocation: 'Distribution Center - Downtown',
        deliveryPerson: {
          name: 'Mike Johnson',
          phone: '+1 234 567 8900',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
        items: [
          {
            _id: '1',
            name: 'Organic Whole Milk',
            brand: 'FreshFarm',
            quantity: 2,
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100',
          },
          {
            _id: '2',
            name: 'Greek Yogurt',
            brand: 'Creamy Delight',
            quantity: 1,
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1571212515416-eb1db804eab7?w=100',
          },
        ],
        totalAmount: 16.97,
        address: {
          fullName: 'John Doe',
          addressLine1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1 234 567 8900',
        },
      };

      setOrderData(mockData);
      setLoading(false);

      // Set active step based on status
      switch (mockData.status) {
        case 'confirmed':
          setActiveStep(0);
          break;
        case 'preparing':
          setActiveStep(1);
          break;
        case 'out_for_delivery':
          setActiveStep(2);
          break;
        case 'delivered':
          setActiveStep(3);
          break;
        default:
          setActiveStep(0);
      }
    };

    fetchOrderData();
  }, [trackingNumber]);

  const trackingSteps: TrackingStep[] = [
    {
      label: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      timestamp: '2 hours ago',
      completed: true,
      active: false,
    },
    {
      label: 'Preparing Your Order',
      description: 'We are carefully selecting and packing your items',
      timestamp: '1 hour ago',
      completed: true,
      active: false,
    },
    {
      label: 'Out for Delivery',
      description: 'Your order is on the way to your address',
      timestamp: '30 minutes ago',
      completed: false,
      active: true,
    },
    {
      label: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: '',
      completed: false,
      active: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'out_for_delivery':
        return 'primary';
      case 'preparing':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (index: number) => {
    switch (index) {
      case 0:
        return <CheckCircle />;
      case 1:
        return <Restaurant />;
      case 2:
        return <LocalShipping />;
      case 3:
        return <Inventory />;
      default:
        return <CheckCircle />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading order details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found. Please check your tracking number.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Track Your Order
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Order #{orderData.orderId}
        </Typography>
      </Box>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ color: 'white', textAlign: 'center', py: 4 }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <LocalShipping sx={{ fontSize: 60, mb: 2 }} />
            </motion.div>
            
            <Typography variant="h5" gutterBottom>
              Your order is on the way!
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Estimated delivery: {new Date(orderData.estimatedDelivery).toLocaleString()}
            </Typography>
            
            <Chip
              label={`Tracking: ${orderData.trackingNumber}`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      <Grid container spacing={3}>
        {/* Tracking Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {trackingSteps.map((step, index) => (
                <Step key={step.label} completed={step.completed}>
                  <StepLabel icon={getStatusIcon(index)}>
                    <Typography variant="subtitle1">
                      {step.label}
                    </Typography>
                    {step.timestamp && (
                      <Typography variant="body2" color="text.secondary">
                        {step.timestamp}
                      </Typography>
                    )}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {orderData.currentLocation && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Current Location</Typography>
                </Box>
                <Typography variant="body2">
                  {orderData.currentLocation}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Delivery Person Info */}
          {orderData.deliveryPerson && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Your Delivery Person
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={orderData.deliveryPerson.photo}
                    alt={orderData.deliveryPerson.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {orderData.deliveryPerson.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Partner
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      fullWidth
                      href={`tel:${orderData.deliveryPerson.phone}`}
                    >
                      Call
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<WhatsApp />}
                      fullWidth
                      sx={{ color: '#25D366', borderColor: '#25D366' }}
                    >
                      WhatsApp
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          )}
        </Grid>

        {/* Order Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            
            <List>
              {orderData.items.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.brand} • Qty: ${item.quantity}`}
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < orderData.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${orderData.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Address
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              {orderData.address.fullName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {orderData.address.addressLine1}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ fontSize: 16, mr: 0.5 }} />
              {orderData.address.phone}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Help Section */}
      <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Having issues with your order? We're here to help.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Email />}
          href="mailto:support@dairyshop.com"
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderTracking;
