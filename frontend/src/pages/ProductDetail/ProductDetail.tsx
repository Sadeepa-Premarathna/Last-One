



import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductDetail: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Details
      </Typography>
      <Typography variant="body1">
        This page will show detailed information about a specific product.
      </Typography>
    </Container>
  );
};

export default ProductDetail;
