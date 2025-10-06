import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Stack,
  Badge,
  Zoom,
  Fade,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  Nature,
  Star,
  Visibility,
  CompareArrows,
  FlashOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onQuickView,
  onProductClick,
  isFavorite = false,
}) => {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      brand: product.brand,
    });
    onAddToCart?.(product._id);
    
    // Reset adding state after animation
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product._id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product._id);
  };

  const getExpiryDate = () => {
    const today = new Date();
    const expiryDate = new Date(today.getTime() + product.expiryDays * 24 * 60 * 60 * 1000);
    return expiryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getExpiryStatus = () => {
    if (product.expiryDays <= 2) {
      return { color: 'error', label: 'Expires Soon' };
    } else if (product.expiryDays <= 5) {
      return { color: 'warning', label: 'Fresh' };
    }
    return { color: 'success', label: 'Fresh' };
  };

  const handleCardClick = () => {
    onProductClick?.(product._id);
  };

  const getDiscountPercentage = () => {
    // Mock discount for demo
    return Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0;
  };

  const discount = getDiscountPercentage();
  const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          borderRadius: 3,
          boxShadow: isHovered 
            ? '0 12px 40px rgba(0,0,0,0.15)'
            : '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
          '&:hover .product-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '&:hover .product-image': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleCardClick}
      >
        {/* Product Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <Stack direction="column" spacing={0.5}>
            {product.featured && (
              <Fade in timeout={800}>
                <Chip
                  icon={<Star sx={{ fontSize: 16 }} />}
                  label="Featured"
                  size="small"
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Fade>
            )}
            {product.isOrganic && (
              <Fade in timeout={1000}>
                <Chip
                  icon={<Nature sx={{ fontSize: 16 }} />}
                  label="Organic"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Fade>
            )}
            {discount > 0 && (
              <Badge
                badgeContent={`${discount}% OFF`}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FF5722',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  },
                }}
              >
                <Chip
                  icon={<LocalOffer sx={{ fontSize: 16 }} />}
                  label="SALE"
                  size="small"
                  sx={{
                    backgroundColor: '#FF5722',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Badge>
            )}
            {/* Expiry Date Chip */}
            <Fade in timeout={1200}>
              <Chip
                label={`Exp: ${getExpiryDate()}`}
                size="small"
                color={getExpiryStatus().color as any}
                variant="outlined"
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Fade>
          </Stack>
        </Box>

        {/* Favorite Button */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <Zoom in timeout={600}>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                {isFavorite ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Favorite sx={{ color: '#e91e63' }} />
                  </motion.div>
                ) : (
                  <FavoriteBorder sx={{ color: '#666' }} />
                )}
              </IconButton>
            </Zoom>
          </Tooltip>
        </Box>

        {/* Product Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="220"
            image={product.image}
            alt={product.name}
            className="product-image"
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Quick Actions Overlay */}
          <Box
            className="product-actions"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Quick View">
                <IconButton
                  onClick={handleQuickView}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Compare">
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <CompareArrows />
                </IconButton>
              </Tooltip>
            </Box>

            <Button
              variant="contained"
              startIcon={
                isAdding ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  >
                    <FlashOn />
                  </motion.div>
                ) : (
                  <AddShoppingCart />
                )
              }
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                backgroundColor: isAdding ? '#27AE60' : 'primary.main',
                '&:hover': {
                  backgroundColor: isAdding ? '#27AE60' : 'primary.dark',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  backgroundColor: isAdding ? '#27AE60' : undefined,
                },
              }}
            >
              {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Box>
        </Box>

        {/* Product Content */}
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          {/* Brand */}
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            {product.brand}
          </Typography>

          {/* Product Name */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>

          {/* Product Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {product.description}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating
              value={product.rating}
              readOnly
              size="small"
              precision={0.1}
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.numReviews})
            </Typography>
          </Box>

          {/* Price and Unit */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              {discount > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      fontSize: '1.2rem',
                    }}
                  >
                    ${discountedPrice.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: '1.2rem',
                  }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                per {product.unit}
              </Typography>
            </Box>

            {/* Stock Indicator */}
            <Box sx={{ textAlign: 'right' }}>
              {product.stock > 0 ? (
                <Chip
                  label={`${product.stock} in stock`}
                  size="small"
                  variant="outlined"
                  color={product.stock > 10 ? 'success' : 'warning'}
                  sx={{ fontSize: '0.7rem' }}
                />
              ) : (
                <Chip
                  label="Out of Stock"
                  size="small"
                  color="error"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
