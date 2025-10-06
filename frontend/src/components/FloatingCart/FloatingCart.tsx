import React from 'react';
import {
  Fab,
  Badge,
  Zoom,
  useScrollTrigger,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

interface FloatingCartProps {
  itemCount?: number;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ itemCount }) => {
  const { state } = useCart();
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  const cartItemCount = itemCount !== undefined ? itemCount : state.totalItems;

  return (
    <Zoom in={trigger}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Fab
          component={Link}
          to="/cart"
          color="primary"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
            boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
              boxShadow: '0 12px 35px rgba(46, 125, 50, 0.4)',
            },
          }}
        >
          <Badge
            badgeContent={cartItemCount}
            color="secondary"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                fontWeight: 600,
                minWidth: 20,
                height: 20,
              },
            }}
          >
            <ShoppingCart sx={{ fontSize: 28 }} />
          </Badge>
        </Fab>
      </motion.div>
    </Zoom>
  );
};

export default FloatingCart;
