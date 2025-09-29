// Basic rate limiting middleware using express-rate-limit
const rateLimit = require('express-rate-limit');

// Limit repeated requests to authentication endpoints
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many attempts from this IP, please try again after 15 minutes.'
});
