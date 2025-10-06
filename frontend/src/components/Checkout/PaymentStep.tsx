import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  LocalAtm,
  Security,
  CheckCircle,
  Payment,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PaymentMethod } from '../../pages/Checkout/Checkout';

interface PaymentStepProps {
  selectedPayment: PaymentMethod | null;
  onPaymentSelect: (payment: PaymentMethod) => void;
  totalAmount: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    title: 'Credit/Debit Card',
    details: 'Pay securely with your card',
    icon: 'credit_card',
  },
  {
    id: 'cash',
    type: 'cash',
    title: 'Cash on Delivery',
    details: 'Pay when your order arrives',
    icon: 'local_atm',
  },
  {
    id: 'digital_wallet',
    type: 'digital_wallet',
    title: 'Digital Wallet',
    details: 'PayPal, Apple Pay, Google Pay',
    icon: 'account_balance_wallet',
  },
];

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedPayment,
  onPaymentSelect,
  totalAmount,
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [selectedDigitalWallet, setSelectedDigitalWallet] = useState('');

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    onPaymentSelect(method);
  };

  const getPaymentIcon = (iconType: string) => {
    switch (iconType) {
      case 'credit_card':
        return <CreditCard />;
      case 'local_atm':
        return <LocalAtm />;
      case 'account_balance_wallet':
        return <AccountBalanceWallet />;
      default:
        return <Payment />;
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    return digits.replace(/(\d{2})(\d{1,2})/, '$1/$2').substr(0, 5);
  };

  const isCardFormValid = () => {
    return (
      cardDetails.cardNumber.replace(/\s/g, '').length >= 16 &&
      cardDetails.expiryDate.length === 5 &&
      cardDetails.cvv.length >= 3 &&
      cardDetails.cardholderName.trim().length > 0
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={6} md={4} key={method.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedPayment?.id === method.id ? 2 : 1,
                  borderColor: selectedPayment?.id === method.id ? 'primary.main' : 'grey.300',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => handlePaymentMethodSelect(method)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  {getPaymentIcon(method.icon!)}
                  <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
                    {method.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.details}
                  </Typography>
                  {selectedPayment?.id === method.id && (
                    <CheckCircle
                      color="primary"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Card Payment Form */}
      {selectedPayment?.type === 'card' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Card Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  value={cardDetails.cardholderName}
                  onChange={(e) =>
                    setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))
                  }
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    setCardDetails(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))
                  }
                  placeholder="MM/YY"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))
                  }
                  placeholder="123"
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Security color="success" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Your payment information is encrypted and secure
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Digital Wallet Options */}
      {selectedPayment?.type === 'digital_wallet' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Digital Wallet
            </Typography>
            <RadioGroup
              value={selectedDigitalWallet}
              onChange={(e) => setSelectedDigitalWallet(e.target.value)}
            >
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src="https://cdn.worldvectorlogo.com/logos/paypal.svg"
                      alt="PayPal"
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    PayPal
                  </Box>
                }
              />
              <FormControlLabel
                value="apple_pay"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalance sx={{ mr: 1 }} />
                    Apple Pay
                  </Box>
                }
              />
              <FormControlLabel
                value="google_pay"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceWallet sx={{ mr: 1 }} />
                    Google Pay
                  </Box>
                }
              />
            </RadioGroup>
          </Paper>
        </motion.div>
      )}

      {/* Cash on Delivery Info */}
      {selectedPayment?.type === 'cash' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Cash on Delivery</strong><br />
              • Pay ${totalAmount.toFixed(2)} when your order arrives<br />
              • Additional COD charges may apply<br />
              • Please keep exact change ready<br />
              • Payment accepted in cash only
            </Typography>
          </Alert>
        </motion.div>
      )}

      {/* Payment Summary */}
      <Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Payment Summary
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Payment Method" />
            <Typography variant="body2">
              {selectedPayment ? selectedPayment.title : 'Not selected'}
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Total Amount" />
            <Typography variant="h6" color="primary">
              ${totalAmount.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
        
        {selectedPayment?.type === 'card' && !isCardFormValid() && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please fill in all card details to continue
          </Alert>
        )}
        
        {selectedPayment?.type === 'digital_wallet' && !selectedDigitalWallet && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please select a digital wallet option to continue
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentStep;
