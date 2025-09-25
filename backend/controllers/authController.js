// Login a user
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Find user by username or email
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Generate a dummy token (replace with JWT in production)
        const token = 'dummy-token';
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ message: 'Login successful.', token, user: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
};
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        // Create user
        const user = new User({ username, email, password });
        await user.save();
        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ message: 'User registered successfully.', user: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};
