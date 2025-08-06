const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
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

    // Create new post
    const post = new Post({
      user_id: userId,
      content: content.trim()
    });

    await post.save();

    // Populate user information
    await post.populate('user_id', 'name email avatar_url');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        user_id: post.user_id._id,
        user_name: post.user_id.name,
        user_avatar: post.user_id.avatar_url,
        likeCount: post.likeCount,
        commentCount: post.commentCount
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts with user information, sorted by creation date (newest first)
    const posts = await Post.find()
      .populate('user_id', 'name email avatar_url')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      user_id: post.user_id._id,
      user_name: post.user_id.name,
      user_avatar: post.user_id.avatar_url,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0
    }));

    res.json({
      message: 'Posts retrieved successfully',
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Failed to retrieve posts',
      error: 'POSTS_RETRIEVAL_FAILED'
    });
  }
});

// @route   GET /api/posts/search
// @desc    Search posts by content
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        message: 'Search query is required',
        error: 'SEARCH_QUERY_REQUIRED'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Search posts by content using regex (case-insensitive)
    const searchFilter = {
      content: { $regex: query.trim(), $options: 'i' }
    };

    const posts = await Post.find(searchFilter)
      .populate('user_id', 'name email avatar_url')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      user_id: post.user_id._id,
      user_name: post.user_id.name,
      user_avatar: post.user_id.avatar_url,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0
    }));

    res.json({
      message: 'Posts search completed',
      posts: formattedPosts,
      query: query.trim(),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      message: 'Failed to search posts',
      error: 'POSTS_SEARCH_FAILED'
    });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by a specific user
// @access  Private
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Get user's posts
    const posts = await Post.find({ user_id: userId })
      .populate('user_id', 'name email avatar_url')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await Post.countDocuments({ user_id: userId });
    const totalPages = Math.ceil(totalPosts / limit);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      user_id: post.user_id._id,
      user_name: post.user_id.name,
      user_avatar: post.user_id.avatar_url,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0
    }));

    res.json({
      message: 'User posts retrieved successfully',
      posts: formattedPosts,
      user: {
        id: user._id,
        name: user.name,
        avatar_url: user.avatar_url
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      message: 'Failed to retrieve user posts',
      error: 'USER_POSTS_RETRIEVAL_FAILED'
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('user_id', 'name email avatar_url')
      .populate('comments.user_id', 'name avatar_url')
      .lean();

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    // Format post for response
    const formattedPost = {
      id: post._id,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      user_id: post.user_id._id,
      user_name: post.user_id.name,
      user_avatar: post.user_id.avatar_url,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
      comments: post.comments ? post.comments.map(comment => ({
        id: comment._id,
        content: comment.content,
        created_at: comment.createdAt,
        user_id: comment.user_id._id,
        user_name: comment.user_id.name,
        user_avatar: comment.user_id.avatar_url
      })) : []
    };

    res.json({
      message: 'Post retrieved successfully',
      post: formattedPost
    });
  } catch (error) {
    console.error('Get post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }
    
    res.status(500).json({
      message: 'Failed to retrieve post',
      error: 'POST_RETRIEVAL_FAILED'
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', authenticateToken, postValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    // Check if user owns the post
    if (post.user_id.toString() !== userId) {
      return res.status(403).json({
        message: 'You can only edit your own posts',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    // Update post
    post.content = content.trim();
    await post.save();

    // Get updated post with user information
    await post.populate('user_id', 'name email avatar_url');

    res.json({
      message: 'Post updated successfully',
      post: {
        id: post._id,
        content: post.content,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        user_id: post.user_id._id,
        user_name: post.user_id.name,
        user_avatar: post.user_id.avatar_url,
        likeCount: post.likeCount,
        commentCount: post.commentCount
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }
    
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
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        error: 'POST_NOT_FOUND'
      });
    }

    // Check if user owns the post
    if (post.user_id.toString() !== userId) {
      return res.status(403).json({
        message: 'You can only delete your own posts',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    await Post.findByIdAndDelete(id);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID',
        error: 'INVALID_POST_ID'
      });
    }
    
    res.status(500).json({
      message: 'Failed to delete post',
      error: 'POST_DELETION_FAILED'
    });
  }
});

module.exports = router;
