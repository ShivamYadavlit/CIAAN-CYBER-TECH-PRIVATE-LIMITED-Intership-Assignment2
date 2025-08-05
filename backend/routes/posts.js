const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { postValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticateToken, postValidation, handleValidationErrors, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const result = await executeQuery(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [userId, content]
    );

    // Get the created post with user information
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
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Post created successfully',
      post: posts[0]
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      message: 'Failed to create post',
      error: 'POST_CREATION_FAILED'
    });
  }
});

// @route   GET /api/posts
// @desc    Get all posts for the feed (paginated)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Ensure parameters are valid numbers
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    console.log('Posts query params:', { page, limit, offset });

    // Get posts with user information
    const posts = await executeQuery(`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get total count for pagination
    const totalCounts = await executeQuery('SELECT COUNT(*) as count FROM posts');
    const totalPosts = totalCounts[0].count;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      message: 'Posts retrieved successfully',
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
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Failed to get posts',
      error: 'POSTS_FETCH_FAILED'
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }

    const posts = await executeQuery(`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    res.json({
      message: 'Post retrieved successfully',
      post: posts[0]
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      message: 'Failed to get post',
      error: 'POST_FETCH_FAILED'
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', authenticateToken, postValidation, handleValidationErrors, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }

    // Check if post exists and belongs to the user
    const posts = await executeQuery(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        message: 'You can only edit your own posts',
        error: 'UNAUTHORIZED_EDIT'
      });
    }

    // Update the post
    await executeQuery(
      'UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, postId]
    );

    // Get the updated post with user information
    const updatedPosts = await executeQuery(`
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
      WHERE p.id = ?
    `, [postId]);

    res.json({
      message: 'Post updated successfully',
      post: updatedPosts[0]
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      message: 'Failed to update post',
      error: 'POST_UPDATE_FAILED'
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }

    // Check if post exists and belongs to the user
    const posts = await executeQuery(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        message: 'You can only delete your own posts',
        error: 'UNAUTHORIZED_DELETE'
      });
    }

    // Delete the post
    await executeQuery('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      message: 'Failed to delete post',
      error: 'POST_DELETE_FAILED'
    });
  }
});

module.exports = router;
