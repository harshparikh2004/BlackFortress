
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation, verifyRecaptcha } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');


// Registration route with validation, rate limiting, and reCAPTCHA
router.post('/register', authLimiter, verifyRecaptcha, registerValidation, authController.register);

// Login route with validation, rate limiting, and reCAPTCHA
router.post('/login', authLimiter, verifyRecaptcha, loginValidation, authController.login);

module.exports = router;
