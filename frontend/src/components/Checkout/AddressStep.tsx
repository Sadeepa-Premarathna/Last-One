import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Home,
  Work,
  Place,
  MyLocation,
  Map,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Address } from '../../pages/Checkout/Checkout';

interface AddressStepProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({
  selectedAddress,
  onAddressSelect,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      fullName: 'John Doe',
      phone: '+1 234 567 8900',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: '2',
      type: 'work',
      fullName: 'John Doe',
      phone: '+1 234 567 8900',
      addressLine1: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr
      ));
    } else {
      const address = { ...newAddress, id: Date.now().toString() };
      setAddresses(prev => [...prev, address]);
      if (addresses.length === 0) {
        onAddressSelect(address);
      }
    }
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
      onAddressSelect(addresses.find(addr => addr.id !== id) || addresses[0]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNewAddress(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude }
          }));
          // In a real app, you would reverse geocode these coordinates
          alert(`Location captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home />;
      case 'work': return <Work />;
      default: return <Place />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Address
      </Typography>

      {addresses.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No saved addresses. Please add a delivery address to continue.
        </Alert>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} key={address.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedAddress?.id === address.id ? 2 : 1,
                    borderColor: selectedAddress?.id === address.id ? 'primary.main' : 'grey.300',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleAddressSelect(address)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getAddressIcon(address.type)}
                        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                          {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                        </Typography>
                        {address.isDefault && (
                          <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id!);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {address.fullName}
                    </Typography>
                    
                    <Typography variant="body2">
                      {address.addressLine1}
                    </Typography>
                    
                    {address.addressLine2 && (
                      <Typography variant="body2">
                        {address.addressLine2}
                      </Typography>
                    )}
                    
                    <Typography variant="body2">
                      {address.city}, {address.state} {address.zipCode}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {address.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => setShowAddForm(true)}
        sx={{ mb: 2 }}
      >
        Add New Address
      </Button>

      <Button
        variant="outlined"
        startIcon={<Map />}
        onClick={() => setShowMapDialog(true)}
        sx={{ mb: 2, ml: 2 }}
      >
        Select on Map
      </Button>

      {/* Add/Edit Address Dialog */}
      <Dialog
        open={showAddForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Type</InputLabel>
                <Select
                  value={newAddress.type}
                  label="Address Type"
                  onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                startIcon={<MyLocation />}
                onClick={getCurrentLocation}
                fullWidth
                sx={{ height: 56 }}
              >
                Use Current Location
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            onClick={handleSaveAddress}
            variant="contained"
            disabled={!newAddress.fullName || !newAddress.addressLine1 || !newAddress.city}
          >
            {editingAddress ? 'Update' : 'Add'} Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Map Dialog */}
      <Dialog
        open={showMapDialog}
        onClose={() => setShowMapDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Address on Map</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 400,
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Google Maps Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Map component would be integrated here
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMapDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowMapDialog(false)}>
            Select This Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressStep;
