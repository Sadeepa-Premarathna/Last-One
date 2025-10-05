import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  Person,
  Favorite,
  Close,
  Home,
  Inventory,
  ContactMail,
  TrendingUp,
  LocalOffer,
  Nature,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName] = useState('John Doe'); // This would come from auth context in real app
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Inventory /> },
    { label: 'Orders', path: '/orders', icon: <LocalOffer /> },
    { label: 'Contact', path: '/contact', icon: <ContactMail /> },
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #2D5930 0%, #7CB342 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            component="img"
            src="/assets/images/dairy-licious-logo.png"
            alt="Dairy Licious Logo"
            sx={{
              width: 40,
              height: 40,
              mr: 1,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
            onError={(e: any) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline-block';
            }}
          />
          <Box
            sx={{
              display: 'none',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
              DL
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
            }}
          >
            Dairy Licious
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Premium Natural Dairy Products
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.label}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ px: 2 }}>
          <Chip
            icon={<TrendingUp />}
            label="New Arrivals"
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mb: 1, mr: 1, fontFamily: 'Poppins, sans-serif' }}
          />
          <Chip
            icon={<LocalOffer />}
            label="Special Offers"
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ mb: 1, fontFamily: 'Poppins, sans-serif' }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.3s ease-in-out',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 70, md: 80 },
              px: { xs: 2, md: 0 },
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'primary.main',
                  mr: { xs: 2, md: 6 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    mr: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/dairy-licious-logo.png"
                    alt="Dairy Licious Logo"
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                    onError={(e: any) => {
                      // Fallback to text if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Typography
                    sx={{
                      display: 'none',
                      color: 'primary.main',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Poppins',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    DL
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2D5930 0%, #7CB342 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    Dairy Licious
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      color: 'text.secondary',
                      display: { xs: 'none', sm: 'block' },
                      lineHeight: 1,
                    }}
                  >
                    Premium Natural
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                {menuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                        backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.main',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                mx: 3,
              }}
            >
              <TextField
                placeholder="Search Dairy Licious products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    fontFamily: 'Poppins, sans-serif',
                    borderRadius: 3,
                    backgroundColor: 'grey.50',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Favorites */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                    },
                  }}
                >
                  <Favorite />
                </IconButton>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                    },
                  }}
                >
                  <Badge
                    badgeContent={state.totalItems}
                    color="secondary"
                    max={99}
                    sx={{
                      '& .MuiBadge-badge': {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                      },
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </motion.div>

              {/* User Menu */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    ml: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      fontSize: 18,
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    <Person />
                  </Avatar>
                </IconButton>
              </motion.div>
            </Box>
          </Toolbar>
        </Container>

        {/* Features Banner */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  py: 1,
                  textAlign: 'center',
                }}
              >
                <Container maxWidth="xl">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 4,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Nature fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                      >
                        100% Organic
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalOffer fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                      >
                        Free Shipping Over $50
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                      >
                        Fresh Daily Delivery
                      </Typography>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 12,
          sx: {
            mt: 1.5,
            borderRadius: 3,
            minWidth: 280,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
            '& .MuiMenuItem-root': {
              fontFamily: 'Poppins, sans-serif',
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
                transform: 'translateX(4px)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Welcome Message */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Welcome back!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {userName}
          </Typography>
        </Box>

        <MenuItem onClick={handleMenuClose}>
          <AccountCircle sx={{ mr: 2 }} />
          My Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <LocalOffer sx={{ mr: 2 }} />
          My Orders
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Favorite sx={{ mr: 2 }} />
          Favorites
        </MenuItem>
        <Divider sx={{ mx: 2 }} />
        <MenuItem 
          onClick={handleMenuClose}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.main',
            },
          }}
        >
          <Logout sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default Navbar;
