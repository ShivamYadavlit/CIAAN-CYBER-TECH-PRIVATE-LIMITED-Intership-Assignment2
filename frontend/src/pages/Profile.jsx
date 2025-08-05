import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { 
  Edit, 
  Calendar, 
  Mail, 
  MapPin, 
  Link as LinkIcon,
  MessageCircle,
  Heart,
  Share,
  Plus,
  Save,
  X
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
      const response = await userAPI.updateProfile(user.id, {
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
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
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
                className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="form-error">{errors.name}</p>
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
                className={`input-field resize-none ${errors.bio ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && (
                  <p className="form-error">{errors.bio}</p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.bio.length}/500
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

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
    <div className="post-card">
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{formatDate(post.created_at)}</span>
        {post.updated_at !== post.created_at && (
          <span className="text-xs">Edited</span>
        )}
      </div>

      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            isLiked 
              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">Like</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-linkedin-blue hover:bg-blue-50 transition-all duration-200">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Comment</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
          <Share className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
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

  const isOwnProfile = currentUser?.id === parseInt(userId);

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
      const response = await userAPI.getProfile(userId);
      setProfileUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setPostsLoading(true);
      else setLoadingMore(true);

      const response = await userAPI.getUserPosts(userId, pageNum, 10);
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
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchPosts();
    }
  }, [userId, fetchProfile, fetchPosts]);

  const handleProfileUpdate = async (updatedData) => {
    setProfileUser(prev => ({ ...prev, ...updatedData }));
    
    // Update auth context if it's the current user's profile
    if (isOwnProfile) {
      await updateUserProfile(currentUser.id, updatedData);
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
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-linkedin-blue to-linkedin-lightblue rounded-t-xl"></div>
          
          <div className="px-6 pb-6">
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-linkedin-blue to-linkedin-lightblue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileUser?.avatar_url ? (
                      <img 
                        src={profileUser.avatar_url} 
                        alt={profileUser.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      getInitials(profileUser?.name)
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profileUser?.name}</h1>
                    <p className="text-gray-600 mt-1">{profileUser?.email}</p>
                  </div>
                  
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="btn-secondary mt-4 sm:mt-0 flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="mt-6 space-y-4">
              {profileUser?.bio && (
                <p className="text-gray-700 leading-relaxed">{profileUser.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
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
                  <span>{profileUser?.postCount || 0} posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isOwnProfile ? 'Your Posts' : `${profileUser?.name?.split(' ')[0]}'s Posts`}
            </h2>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading posts...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? 'Share your first post with your network!' 
                  : `${profileUser?.name?.split(' ')[0]} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
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
