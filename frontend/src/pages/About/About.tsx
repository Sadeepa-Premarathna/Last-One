import React from 'react';
import { Container, Typography } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About FreshDairy
      </Typography>
      <Typography variant="body1">
        Learn more about our company, our mission, and our commitment to providing the freshest dairy products.
      </Typography>
    </Container>
  );
};

export default About;
