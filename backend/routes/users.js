const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { profileUpdateValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID',
        error: 'INVALID_USER_ID'
      });
    }

    const users = await executeQuery(
      'SELECT id, name, email, bio, avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const user = users[0];

    // Get user's post count
    const postCounts = await executeQuery(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [userId]
    );

    user.postCount = postCounts[0].count;

    res.json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      message: 'Failed to get user profile',
      error: 'PROFILE_FETCH_FAILED'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', authenticateToken, profileUpdateValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, bio } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID',
        error: 'INVALID_USER_ID'
      });
    }

    // Check if user is updating their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({
        message: 'You can only update your own profile',
        error: 'UNAUTHORIZED_UPDATE'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update',
        error: 'NO_UPDATE_FIELDS'
      });
    }

    updateValues.push(userId);

    await executeQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    // Get updated user data
    const users = await executeQuery(
      'SELECT id, name, email, bio, avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: 'PROFILE_UPDATE_FAILED'
    });
  }
});

// @route   GET /api/users/:id/posts
// @desc    Get posts for a specific user
// @access  Private
router.get('/:id/posts', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    // Ensure parameters are valid numbers
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    console.log('User posts query params:', { userId, page, limit, offset });

    if (isNaN(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID',
        error: 'INVALID_USER_ID'
      });
    }

    // Check if user exists
    const users = await executeQuery(
      'SELECT id, name FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get user's posts with pagination
    const posts = await executeQuery(`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.name as user_name,
        u.avatar_url as user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `, [userId]);

    // Get total count for pagination
    const totalCounts = await executeQuery(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [userId]
    );

    const totalPosts = totalCounts[0].count;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      message: 'User posts retrieved successfully',
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      message: 'Failed to get user posts',
      error: 'USER_POSTS_FETCH_FAILED'
    });
  }
});

// @route   GET /api/users
// @desc    Search users (for mentions, connections, etc.)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, name, email, bio, avatar_url, created_at
      FROM users
    `;
    let queryParams = [];

    if (search) {
      query += ` WHERE name LIKE ? OR email LIKE ?`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}`;

    const users = await executeQuery(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    let countParams = [];

    if (search) {
      countQuery += ' WHERE name LIKE ? OR email LIKE ?';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const totalCounts = await executeQuery(countQuery, countParams);
    const totalUsers = totalCounts[0].count;
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Failed to search users',
      error: 'USER_SEARCH_FAILED'
    });
  }
});

module.exports = router;
