import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  Chip,
  Avatar,
  Button,
  Divider,
  Stack,
  Paper,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  Receipt,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    date: '2025-08-28',
    status: 'delivered',
    total: 45.97,
    items: [
      {
        name: 'Organic Whole Milk',
        quantity: 2,
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      },
      {
        name: 'Greek Yogurt',
        quantity: 3,
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1571212059353-05d1e2c5c8b5?w=400',
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    date: '2025-08-29',
    status: 'shipped',
    total: 28.47,
    items: [
      {
        name: 'Artisan Cheddar Cheese',
        quantity: 1,
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
      },
      {
        name: 'Premium Butter',
        quantity: 2,
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
      },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    date: '2025-08-30',
    status: 'processing',
    total: 19.98,
    items: [
      {
        name: 'Vanilla Ice Cream',
        quantity: 1,
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400',
      },
      {
        name: 'Heavy Cream',
        quantity: 2,
        price: 5.49,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      },
    ],
  },
];

const Orders: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'shipped':
        return <LocalShipping sx={{ color: 'info.main' }} />;
      case 'processing':
        return <Schedule sx={{ color: 'warning.main' }} />;
      default:
        return <Schedule sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{ fontFamily: 'Poppins, sans-serif' }}
          >
            My Orders
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Track and manage your dairy product orders
          </Typography>
        </Box>

        {mockOrders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 3,
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
              }}
            >
              <Receipt sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight={600}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            >
              No Orders Yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontFamily: 'Poppins, sans-serif' }}
            >
              Start shopping and your orders will appear here.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                px: 4,
                py: 1.5,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {mockOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 8,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Order {order.orderNumber}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status) as any}
                        sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary.main"
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        ${order.total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Order Items */}
                  <Grid container spacing={2}>
                    {order.items.map((item, itemIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 50, height: 50 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Order Actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 3,
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Receipt />}
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      View Details
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {order.status === 'delivered' && (
                        <Button
                          variant="contained"
                          startIcon={<Refresh />}
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        >
                          Reorder
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button
                          variant="contained"
                          startIcon={<LocalShipping />}
                          size="small"
                          color="info"
                          sx={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Track Order
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}
      </motion.div>
    </Container>
  );
};

export default Orders;
