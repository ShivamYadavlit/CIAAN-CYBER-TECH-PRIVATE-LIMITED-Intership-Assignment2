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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.bio ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="text-red-600 text-sm mt-1">{errors.bio}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-2"
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>
        {currentUser && post.user_id === currentUser.id && (
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Post options"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  disabled={isUpdating || isDeleting}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
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
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="What's on your mind?"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditPost}
                disabled={isUpdating || !editContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{isUpdating ? 'Updating...' : 'Update'}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            isLiked 
              ? 'text-red-600 bg-red-50 shadow-sm border border-red-100' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:shadow-sm hover:border hover:border-red-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-semibold">Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm hover:border hover:border-blue-100 transition-all duration-200 transform hover:scale-105 font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 hover:shadow-sm hover:border hover:border-green-100 transition-all duration-200 transform hover:scale-105 font-medium">
          <Share className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {currentUser?.name ? getInitials(currentUser.name) : 'U'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-200 shadow-sm">
              <Send className="w-5 h-5" />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="glass-card bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/60 p-8 text-center modern-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 text-lg font-medium">{error}</p>
            <button
              onClick={fetchProfile}
              className="btn-primary shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileUser?.avatar_url ? (
                <img 
                  src={profileUser.avatar_url} 
                  alt={profileUser.name} 
                  className="w-24 h-24 rounded-full object-cover" 
                />
              ) : (
                getInitials(profileUser?.name)
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileUser?.name}
              </h1>
              <p className="text-gray-600">{profileUser?.email}</p>
            </div>
            
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
          
          {/* Bio Section */}
          {profileUser?.bio && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{profileUser.bio}</p>
            </div>
          )}
          
          {/* Profile Stats */}
          <div className="mt-6 flex space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{profileUser?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(profileUser?.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>{posts.length} posts</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Posts' : `${profileUser?.name?.split(' ')[0]}'s Posts`}
          </h2>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? 'Share your first post!' 
                  : `${profileUser?.name?.split(' ')[0]} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
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
                <div className="text-center mt-8">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 mx-auto"
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
