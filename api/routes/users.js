const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Example: Get all users (Admin only)
router.get('/all', authenticateToken, authorizeRoles('Admin'), userController.getAllUsers);

// Example: Get own profile (User or Admin)
router.get('/profile', authenticateToken, authorizeRoles('User', 'Admin'), userController.getProfile);

// Example: Update own profile (User or Admin)
router.put('/profile', authenticateToken, authorizeRoles('User', 'Admin'), userController.updateProfile);

module.exports = router;
