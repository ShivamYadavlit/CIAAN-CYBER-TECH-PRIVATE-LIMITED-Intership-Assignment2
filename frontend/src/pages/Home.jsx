import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { postAPI } from '../services/api';
import { Plus, Heart, MessageCircle, Share, Send, Image, Video, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-linkedin-blue to-linkedin-lightblue rounded-full flex items-center justify-center text-white font-semibold">
          {post.user_avatar ? (
            <img src={post.user_avatar} alt={post.user_name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            getInitials(post.user_name)
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 hover:text-linkedin-blue cursor-pointer transition-colors duration-200">
            {post.user_name}
          </h3>
          <p className="text-sm text-gray-500">{post.user_email}</p>
          <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
        </div>
        {post.user_id === user?.id && (
          <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-4">
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isLiked 
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-linkedin-blue hover:bg-blue-50 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-linkedin-blue to-linkedin-lightblue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-linkedin-blue focus:border-transparent transition-all duration-200"
                />
              </div>
              <button className="p-2 text-linkedin-blue hover:bg-blue-50 rounded-full transition-all duration-200">
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
    <div className="card mb-6">
      <div className="flex space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-linkedin-blue to-linkedin-lightblue rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Share your thoughts..."
              className={`w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-blue focus:border-transparent transition-all duration-200 resize-none ${
                isExpanded ? 'h-24 p-4' : 'h-12 p-3'
              }`}
              maxLength={2000}
            />
            
            {isExpanded && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-linkedin-blue hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-linkedin-blue hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-linkedin-blue hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Event</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{content.length}/2000</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Post</span>
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

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading your feed...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Share your thoughts and connect with your network.</p>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchPosts(1, true)}
              className="mt-2 text-red-700 hover:text-red-900 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share something with your network!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              {loadingMore ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{loadingMore ? 'Loading...' : 'Load More Posts'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
