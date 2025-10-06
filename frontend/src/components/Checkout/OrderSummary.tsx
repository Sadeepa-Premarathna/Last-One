import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  LocalShipping,
  Schedule,
  Nature,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

const OrderSummary: React.FC = () => {
  const { state } = useCart();
  
  const subtotal = state.totalPrice;
  const deliveryFee = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>

        <List sx={{ py: 0 }}>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemText primary="Subtotal" />
            <Typography variant="body2">
              ${subtotal.toFixed(2)}
            </Typography>
          </ListItem>
          
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ fontSize: 16, mr: 0.5 }} />
                  Delivery Fee
                </Box>
              }
            />
            <Typography variant="body2">
              ${deliveryFee.toFixed(2)}
            </Typography>
          </ListItem>
          
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemText primary="Tax" />
            <Typography variant="body2">
              ${tax.toFixed(2)}
            </Typography>
          </ListItem>
          
          <Divider sx={{ my: 1 }} />
          
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemText 
              primary={
                <Typography variant="h6">
                  Total
                </Typography>
              }
            />
            <Typography variant="h6" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
          <Chip
            icon={<Schedule />}
            label="Estimated delivery: Tomorrow"
            size="small"
            variant="outlined"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            icon={<Nature />}
            label="Fresh products"
            size="small"
            variant="outlined"
            color="success"
            sx={{ mb: 1 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Free delivery on orders over $50
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
