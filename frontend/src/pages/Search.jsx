import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import { 
  Search as SearchIcon, 
  User, 
  MessageCircle, 
  Calendar,
  Heart,
  Share,
  Users,
  FileText,
  X
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-12 h-12 rounded-full object-cover" 
            />
          ) : (
            getInitials(user.name)
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {user.name}
          </h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
          {user.bio && (
            <p className="text-gray-500 text-sm mt-1">{user.bio}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
            {user.postCount !== undefined && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{user.postCount} posts</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div 
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
          onClick={() => navigate(`/profile/${post.user_id}`)}
        >
          {post.user_avatar ? (
            <img src={post.user_avatar} alt={post.user_name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            getInitials(post.user_name)
          )}
        </div>
        <div className="flex-1">
          <h3 
            className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate(`/profile/${post.user_id}`)}
          >
            {post.user_name}
          </h3>
          <p className="text-sm text-gray-600">{formatDate(post.created_at)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-3 border-t border-gray-200">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
            isLiked 
              ? 'text-red-600 bg-red-50' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">Like</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
          <Share className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'all');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Perform search
  const performSearch = useCallback(async (searchQuery, type = 'all') => {
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    
    if (type === 'all' || type === 'users') {
      setUsersLoading(true);
      try {
        const response = await userAPI.searchUsers(searchQuery);
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    }

    if (type === 'all' || type === 'posts') {
      setPostsLoading(true);
      try {
        const response = await postAPI.searchPosts(searchQuery);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Error searching posts:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    }
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL params
    setSearchParams({ q: query, type: activeTab });
    performSearch(query, activeTab);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (query.trim()) {
      setSearchParams({ q: query, type: tab });
      performSearch(query, tab);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setUsers([]);
    setPosts([]);
    setHasSearched(false);
    setSearchParams({});
  };

  // Load initial search if URL has params
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlType = searchParams.get('type') || 'all';
    
    if (urlQuery) {
      setQuery(urlQuery);
      setActiveTab(urlType);
      performSearch(urlQuery, urlType);
    }
  }, [searchParams, performSearch]);

  const totalResults = users.length + posts.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search
            </h1>
            <p className="text-gray-600">
              Find people and posts
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for people, posts, or content..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />{query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Search Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            <button
              onClick={() => handleTabChange('all')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>People</span>
            </button>
            <button
              onClick={() => handleTabChange('posts')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'posts'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Posts</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        {!hasSearched ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">
              Search for people in your network or find interesting posts
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            {(hasSearched && !usersLoading && !postsLoading) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
            )}

            {/* Users Results */}
            {(activeTab === 'all' || activeTab === 'users') && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">People</h2>
                  {!usersLoading && (
                    <span className="text-sm text-gray-500">({users.length})</span>
                  )}
                </div>

                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : users.length > 0 ? (
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                ) : hasSearched && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No people found matching "{query}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Posts Results */}
            {(activeTab === 'all' || activeTab === 'posts') && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
                  {!postsLoading && (
                    <span className="text-sm text-gray-500">({posts.length})</span>
                  )}
                </div>

                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : hasSearched && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No posts found matching "{query}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
