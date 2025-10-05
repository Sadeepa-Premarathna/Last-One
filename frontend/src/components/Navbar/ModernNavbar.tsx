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
  Popover,
  Paper,
  ListItemAvatar,
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  LocalDining,
  Person,
  Favorite,
  Close,
  Home,
  Inventory,
  Info,
  ContactMail,
  TrendingUp,
  LocalOffer,
  Nature,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Mock user data - in real app this would come from auth context
  const [currentUser] = useState({ name: 'John Doe', email: 'john@example.com' });
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

  const handleCartHover = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartLeave = () => {
    setCartAnchorEl(null);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Inventory /> },
    { label: 'About', path: '/about', icon: <Info /> },
    { label: 'Contact', path: '/contact', icon: <ContactMail /> },
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalDining sx={{ mr: 1, fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
            }}
          >
            DairyFresh
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Premium Organic Dairy Products
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 18 }} />
            Welcome, {currentUser.name}!
          </Typography>
        </Box>
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
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    mr: 2,
                    boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                  }}
                >
                  <LocalDining sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    DairyFresh
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
                    Premium Organic
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

            {/* Welcome Message */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                mx: 3,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: 'text.primary',
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Person sx={{ color: 'primary.main' }} />
                  Welcome, {currentUser.name}!
                </Typography>
              </motion.div>
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
                  onMouseEnter={handleCartHover}
                  onMouseLeave={handleCartLeave}
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

        {/* Cart Hover Popup */}
        <Popover
          open={Boolean(cartAnchorEl)}
          anchorEl={cartAnchorEl}
          onClose={handleCartLeave}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            pointerEvents: 'none',
            '& .MuiPopover-paper': {
              pointerEvents: 'auto',
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'grey.200',
            },
          }}
          onMouseEnter={() => setCartAnchorEl(cartAnchorEl)}
          onMouseLeave={handleCartLeave}
        >
          <Paper sx={{ width: 350, maxHeight: 400, overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Shopping Cart ({state.totalItems} items)
              </Typography>
              {state.items.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <ShoppingCart sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Your cart is empty
                  </Typography>
                </Box>
              ) : (
                <>
                  <List sx={{ p: 0 }}>
                    {state.items.slice(0, 4).map((item) => (
                      <ListItem key={item._id} sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 40, height: 40, borderRadius: 1 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.quantity} × ${item.price}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  {state.items.length > 4 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                      +{state.items.length - 4} more items
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      Total: ${state.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Button
                    component={Link}
                    to="/cart"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)',
                      },
                    }}
                  >
                    View Cart
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Popover>

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
          elevation: 8,
          sx: {
            mt: 1.5,
            borderRadius: 3,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              fontFamily: 'Poppins, sans-serif',
              borderRadius: 2,
              mx: 1,
              my: 0.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Favorite sx={{ mr: 2 }} />
          Favorites
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
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
