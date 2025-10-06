import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  Typography,
  Chip,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import {
  KeyboardArrowDown,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Milk',
    value: 'milk',
    icon: '🥛',
    color: '#E3F2FD',
    description: 'Fresh and organic milk',
    count: 12,
  },
  {
    name: 'Cheese',
    value: 'cheese',
    icon: '🧀',
    color: '#FFF3E0',
    description: 'Artisan and aged cheese',
    count: 8,
  },
  {
    name: 'Yogurt',
    value: 'yogurt',
    icon: '🥄',
    color: '#F1F8E9',
    description: 'Creamy and healthy yogurt',
    count: 15,
  },
  {
    name: 'Butter',
    value: 'butter',
    icon: '🧈',
    color: '#FFF8E1',
    description: 'Premium quality butter',
    count: 6,
  },
  {
    name: 'Cream',
    value: 'cream',
    icon: '🥛',
    color: '#F3E5F5',
    description: 'Rich and smooth cream',
    count: 4,
  },
  {
    name: 'Ice Cream',
    value: 'ice-cream',
    icon: '🍦',
    color: '#E8F5E8',
    description: 'Delicious frozen treats',
    count: 10,
  },
];

const CategoryMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          fontWeight: 500,
          px: 2,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white',
          },
        }}
      >
        Categories
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 3,
            minWidth: 600,
            maxWidth: 800,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Shop by Category
          </Typography>

          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} key={category.value}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Paper
                    component={Button}
                    fullWidth
                    onClick={() => handleCategoryClick(category.value)}
                    sx={{
                      p: 2,
                      textAlign: 'left',
                      backgroundColor: category.color,
                      border: 'none',
                      borderRadius: 2,
                      cursor: 'pointer',
                      textTransform: 'none',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backgroundColor: category.color,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: 'white',
                          width: 48,
                          height: 48,
                          fontSize: '1.5rem',
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Chip
                            label={category.count}
                            size="small"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.875rem' }}
                        >
                          {category.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              fullWidth
              onClick={handleClose}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
              }}
            >
              View All Products
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default CategoryMenu;
