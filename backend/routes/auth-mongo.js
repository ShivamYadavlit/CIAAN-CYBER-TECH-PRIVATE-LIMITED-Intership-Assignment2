const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
        error: 'EMAIL_EXISTS'
      });
    }

    // Create user (password will be hashed automatically by the pre-save hook)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      bio: bio ? bio.trim() : undefined
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(), // This excludes the password
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'User already exists with this email',
        error: 'EMAIL_EXISTS'
      });
    }

    res.status(500).json({
      message: 'Failed to register user',
      error: 'REGISTRATION_FAILED'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: user.toJSON(), // This excludes the password
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Failed to login',
      error: 'LOGIN_FAILED'
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
        error: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'Token is valid',
      user: user.toJSON()
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Token verification error:', error);
    res.status(500).json({
      message: 'Token verification failed',
      error: 'VERIFICATION_FAILED'
    });
  }
});

module.exports = router;
