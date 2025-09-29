// Input validation middleware for registration and login
const { body, validationResult } = require('express-validator');

// Registration validation rules
exports.registerValidation = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores.'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address.'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters.'),
    body('role')
        .isIn(['User', 'Admin'])
        .withMessage('Role must be User or Admin.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Login validation rules
exports.loginValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Identifier (email or username) is required.'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
// Google reCAPTCHA v3 verification middleware
const axios = require('axios');

exports.verifyRecaptcha = async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;
    if (!recaptchaToken) {
        return res.status(400).json({ message: 'reCAPTCHA token is required.' });
    }
    try {
        const secretKey = process.env.RECAPTCHA_SECRET || 'YOUR_RECAPTCHA_SECRET_KEY';
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: secretKey,
                response: recaptchaToken
            }
        });
        const data = response.data;
        if (!data.success || data.score < 0.5) {
            return res.status(403).json({ message: 'Failed reCAPTCHA verification.' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'reCAPTCHA verification failed.', error: error.message });
    }
};
