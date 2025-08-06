import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userAPI, postAPI } from '../services/api';
import { 
  Edit, 
  Calendar, 
  Mail, 
  MessageCircle,
  Heart,
  Share,
  Plus,
  Save,
  X,
  MoreHorizontal,
  Check,
  Send
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProfileModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await userAPI.updateProfile({
        name: formData.name.trim(),
        bio: formData.bio.trim()
      });
      
      if (response.data.user) {
        onUpdate(response.data.user);
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base ${errors.bio ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="text-red-600 text-sm mt-1">{errors.bio}</p>
              )}
            </div>

            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 sm:py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base touch-target"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-2.5 sm:py-3 text-sm sm:text-base touch-target"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser, onPostUpdate, onPostDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 space-y-2 xs:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500">{formatDate(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>
        {currentUser && post.user_id === currentUser.id && (
          <div className="relative dropdown-container self-start xs:self-auto">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-full touch-target"
              title="Post options"
            >
              <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-10 sm:top-12 w-36 sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 sm:py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 touch-target"
                  disabled={isUpdating || isDeleting}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  className="w-full px-3 py-2 sm:py-2.5 text-left text-sm text-red-600 hover:bg-gray-100 touch-target"
                  disabled={isUpdating || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4 sm:mb-6">
        {isEditing ? (
          <div className="space-y-3 sm:space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              rows="4"
              placeholder="What's on your mind?"
            />
            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
              <button
                onClick={handleEditPost}
                disabled={isUpdating || !editContent.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 flex-1 xs:flex-none touch-target"
              >
                <Check className="w-4 h-4" />
                <span>{isUpdating ? 'Updating...' : 'Update'}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base flex-1 xs:flex-none touch-target"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {post.content}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm touch-target ${
            isLiked 
              ? 'text-red-600 bg-red-50 shadow-sm border border-red-100' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-sm hover:border hover:border-red-100'
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-semibold hidden xs:block">Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm hover:border hover:border-blue-100 transition-all duration-200 transform hover:scale-105 font-medium text-sm touch-target"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold hidden xs:block">Comment</span>
        </button>

        <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 hover:shadow-sm hover:border hover:border-green-100 transition-all duration-200 transform hover:scale-105 font-medium text-sm touch-target">
          <Share className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold hidden xs:block">Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm flex-shrink-0">
              {currentUser?.name ? getInitials(currentUser.name) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-sm sm:text-base"
              />
            </div>
            <button className="p-2.5 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-200 shadow-sm touch-target flex-shrink-0">
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUserProfile } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const isOwnProfile = !userId || currentUser?.id === userId || currentUser?.id === parseInt(userId) || 
                    currentUser?._id === userId || currentUser?._id === parseInt(userId);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      // If no userId in URL or it's the current user, fetch current user's profile
      if (!userId || isOwnProfile) {
        response = await userAPI.getCurrentProfile();
      } else {
        response = await userAPI.getProfile(userId);
      }
      
      setProfileUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile]);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setPostsLoading(true);
      else setLoadingMore(true);

      // Use current user's ID if no userId in URL - try both id and _id
      const targetUserId = userId || currentUser?.id || currentUser?._id;
      if (!targetUserId) {
        console.error('No user ID available for fetching posts');
        setPostsLoading(false);
        setLoadingMore(false);
        return;
      }

      const response = await userAPI.getUserPosts(targetUserId, pageNum, 10);
      const newPosts = response.data.posts || [];
      
      if (reset || pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(response.data.pagination?.hasNext || false);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setPostsLoading(false);
      setLoadingMore(false);
    }
  }, [userId, currentUser?.id, currentUser?._id]);

  useEffect(() => {
    // Always try to fetch profile - either for the current user or specified user
    fetchProfile();
    fetchPosts();
  }, [fetchProfile, fetchPosts]);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleProfileUpdate = async (updatedData) => {
    setProfileUser(prev => ({ ...prev, ...updatedData }));
    
    // Update auth context if it's the current user's profile
    if (isOwnProfile) {
      const userId = currentUser?.id || currentUser?._id;
      await updateUserProfile(userId, updatedData);
    }
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
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-80">
            <div className="text-center glass-card modern-shadow p-12 rounded-2xl">
              <LoadingSpinner size="xl" />
              <p className="mt-6 text-gray-600 text-lg font-medium">Loading profile...</p>
              <p className="mt-2 text-gray-500 text-sm">Getting user information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 sm:pt-20">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
          <div className="glass-card bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/60 p-6 sm:p-8 text-center modern-shadow">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-4 sm:mb-6 text-base sm:text-lg font-medium px-2">{error}</p>
            <button
              onClick={fetchProfile}
              className="btn-primary shadow-lg hover:shadow-xl text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 touch-target"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl font-bold mx-auto sm:mx-0 flex-shrink-0">
              {profileUser?.avatar_url ? (
                <img 
                  src={profileUser.avatar_url} 
                  alt={profileUser.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover" 
                />
              ) : (
                getInitials(profileUser?.name)
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {profileUser?.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base break-all">{profileUser?.email}</p>
            </div>
            
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 w-full sm:w-auto touch-target"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
          
          {/* Bio Section */}
          {profileUser?.bio && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{profileUser.bio}</p>
            </div>
          )}
          
          {/* Profile Stats */}
          <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row xs:space-x-4 lg:space-x-6 space-y-2 xs:space-y-0 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{profileUser?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Joined {formatDate(profileUser?.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-1">
            {isOwnProfile ? 'Your Posts' : `${profileUser?.name?.split(' ')[0]}'s Posts`}
          </h2>

          {postsLoading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md mx-1">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 text-sm sm:text-base px-4">
                {isOwnProfile 
                  ? 'Share your first post!' 
                  : `${profileUser?.name?.split(' ')[0]} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:space-y-6">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id}
                    post={post} 
                    currentUser={currentUser} 
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 touch-target"
                  >
                    {loadingMore ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={profileUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
};

export default Profile;
