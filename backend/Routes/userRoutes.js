const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  getAllUsers
} = require('../Controllers/userController');

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User profile routes (would need authentication middleware)
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', changePassword);
router.delete('/account', deleteUserAccount);

// Admin routes (would need admin authentication middleware)
router.get('/', getAllUsers);

module.exports = router;
