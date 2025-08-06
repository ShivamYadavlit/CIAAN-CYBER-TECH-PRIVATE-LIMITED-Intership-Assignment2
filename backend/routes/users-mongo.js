const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');
const { profileUpdateValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get user's post count
    const postCount = await Post.countDocuments({ user_id: id });

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      created_at: user.createdAt,
      postCount
    };

    res.json({
      message: 'User profile retrieved successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid user ID',
        error: 'INVALID_USER_ID'
      });
    }
    
    res.status(500).json({
      message: 'Failed to retrieve user profile',
      error: 'PROFILE_RETRIEVAL_FAILED'
    });
  }
});

// @route   GET /api/users/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get user's post count
    const postCount = await Post.countDocuments({ user_id: userId });

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      created_at: user.createdAt,
      postCount
    };

    res.json({
      message: 'Profile retrieved successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Get current user profile error:', error);
    res.status(500).json({
      message: 'Failed to retrieve profile',
      error: 'PROFILE_RETRIEVAL_FAILED'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, profileUpdateValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, avatar_url } = req.body;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar_url !== undefined) user.avatar_url = avatar_url.trim();

    await user.save();

    // Get updated user profile
    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };

    res.json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
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
    
    res.status(500).json({
      message: 'Failed to update profile',
      error: 'PROFILE_UPDATE_FAILED'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (for user discovery)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('name email bio avatar_url createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Add post count for each user
    const usersWithPostCount = await Promise.all(
      users.map(async (user) => {
        const postCount = await Post.countDocuments({ user_id: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar_url: user.avatar_url,
          created_at: user.createdAt,
          postCount
        };
      })
    );

    res.json({
      message: 'Users retrieved successfully',
      users: usersWithPostCount,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to retrieve users',
      error: 'USERS_RETRIEVAL_FAILED'
    });
  }
});

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Delete all user's posts first
    await Post.deleteMany({ user_id: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      message: 'Failed to delete account',
      error: 'ACCOUNT_DELETION_FAILED'
    });
  }
});

module.exports = router;
