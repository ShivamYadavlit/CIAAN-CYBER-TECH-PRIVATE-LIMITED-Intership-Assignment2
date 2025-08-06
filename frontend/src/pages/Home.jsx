import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { postAPI } from '../services/api';
import { Plus, Heart, MessageCircle, Share, Send, Image, Video, Calendar, MoreHorizontal, Edit2, Trash2, X, Check } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditPost = async () => {
    if (!editContent.trim()) return;
    
    setIsUpdating(true);
    try {
      const response = await postAPI.updatePost(post.id, { content: editContent });
      onPostUpdate(response.data.post);
      setIsEditing(false);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await postAPI.deletePost(post.id);
      onPostDelete(post.id);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
    setShowDropdown(false);
  };

  return (
    <div className="glass-card modern-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Post Header */}
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-200">
          {post.user_avatar ? (
            <img src={post.user_avatar} alt={post.user_name} className="w-14 h-14 rounded-xl object-cover" />
          ) : (
            getInitials(post.user_name)
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text cursor-pointer transition-all duration-300 text-lg">
            {post.user_name}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{post.user_email}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(post.created_at)}</p>
        </div>
        {post.user_id === user?.id && (
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 rounded-xl transition-all duration-200 border border-gray-200/60 hover:border-gray-300 shadow-sm hover:shadow-md backdrop-blur-sm"
              title="Post options"
            >
              <div className="flex space-x-0.5">
                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-10 w-48 glass-card shadow-2xl border border-gray-200/30 py-2 z-20 animate-slideInLeft">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50/80 flex items-center space-x-3 transition-all duration-200 hover:text-blue-700"
                  disabled={isUpdating || isDeleting}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="font-medium">Edit post</span>
                </button>
                <button
                  onClick={handleDeletePost}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50/80 flex items-center space-x-3 transition-all duration-200 hover:text-red-700"
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">{isDeleting ? 'Deleting...' : 'Delete post'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-6">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200 text-gray-800"
              rows="5"
              placeholder="What's on your mind?"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditPost}
                disabled={isUpdating || !editContent.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Check className="w-4 h-4" />
                <span>{isUpdating ? 'Updating...' : 'Update'}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200/50">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-lg">
              {post.content}
            </p>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="mt-6 pt-5 border-t border-gray-200/60">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isLiked 
                ? 'text-red-600 bg-gradient-to-r from-red-50 to-pink-50 shadow-md border border-red-200/50' 
                : 'text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-md hover:border hover:border-red-200/50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-bounce' : ''}`} />
            <span className="text-sm font-semibold">Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:border hover:border-blue-200/50"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:border hover:border-green-200/50">
            <Share className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-6 pt-5 border-t border-gray-200/60 animate-slideInLeft">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-md">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                />
              </div>
              <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md border border-blue-200/50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postAPI.createPost({ content: content.trim() });
      if (response.data.post) {
        onPostCreated(response.data.post);
        setContent('');
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card modern-shadow hover:shadow-xl transition-all duration-300 mb-8 border border-gray-200/60">
      <div className="flex space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-200">
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Share your thoughts with the world..."
              className={`w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none bg-gray-50/50 backdrop-blur-sm placeholder-gray-500 ${
                isExpanded ? 'h-28 p-5 text-lg' : 'h-14 p-4'
              }`}
              maxLength={2000}
            />
            
            {isExpanded && (
              <div className="mt-6 flex items-center justify-between animate-slideInLeft">
                <div className="flex items-center space-x-6">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-semibold">Photo</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-semibold">Video</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-semibold">Event</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${content.length > 1800 ? 'text-red-500' : 'text-gray-500'}`}>
                    {content.length}/2000
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                    }}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Share Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await postAPI.getPosts(pageNum, 10);
      const newPosts = response.data.posts || [];
      
      if (reset || pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(response.data.pagination?.hasNext || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-80">
            <div className="text-center glass-card modern-shadow p-12 rounded-2xl">
              <LoadingSpinner size="xl" />
              <p className="mt-6 text-gray-600 text-lg font-medium">Loading your personalized feed...</p>
              <p className="mt-2 text-gray-500 text-sm">Getting the latest updates from your network</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Share your thoughts, connect with your network, and discover amazing content from your community.
          </p>
        </div>

        {/* Create Post */}
        <div className="animate-slideInLeft">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card border border-red-200/60 bg-gradient-to-r from-red-50 to-pink-50 p-6 mb-8 animate-slideInRight">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <button
                  onClick={() => fetchPosts(1, true)}
                  className="mt-2 text-red-600 hover:text-red-800 font-semibold underline underline-offset-2 transition-colors duration-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="glass-card modern-shadow p-12 rounded-2xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts yet</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Be the first to share something amazing with your network! Your thoughts matter.
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
              </div>
            </div>
          ) : (
            posts.map((post, index) => (
              <div 
                key={post.id} 
                className="animate-slideInLeft"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PostCard
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-12 animate-fadeIn">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="btn-secondary flex items-center space-x-3 mx-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loadingMore ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
              <span>{loadingMore ? 'Loading more amazing content...' : 'Load More Posts'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
