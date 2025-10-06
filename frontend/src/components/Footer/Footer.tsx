import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/assets/images/dairy-licious-logo.png"
                alt="Dairy Licious Logo"
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                onError={(e: any) => {
                  // Fallback to text if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Box
                sx={{
                  display: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  DL
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                Dairy Licious
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Your trusted source for premium natural dairy products. 
              Quality you can taste, freshness that delights.
            </Typography>
            <Box>
              <IconButton sx={{ color: 'white', p: 0.5 }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white', p: 0.5 }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white', p: 0.5 }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Home
              </Link>
              <Link href="/products" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Products
              </Link>
              <Link href="/about" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                About Us
              </Link>
              <Link href="/contact" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Contact
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box>
              <Link href="/products?category=milk" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Milk
              </Link>
              <Link href="/products?category=cheese" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Cheese
              </Link>
              <Link href="/products?category=yogurt" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Yogurt
              </Link>
              <Link href="/products?category=butter" color="inherit" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Butter
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
              📧 info@dairylicious.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
              📞 +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
              📍 123 Natural Farm Road, Green Valley, CA 90210
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: 4,
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Dairy Licious. All rights reserved. Made with ❤️ for natural dairy lovers.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
