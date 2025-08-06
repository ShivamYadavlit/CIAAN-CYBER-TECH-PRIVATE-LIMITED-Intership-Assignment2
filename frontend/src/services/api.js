import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://minilinkdin26.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401 || error.response?.status === 403) {
      const errorCode = error.response?.data?.error;
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.post('/auth/verify'),
};

// User API calls
export const userAPI = {
  getProfile: (userId) => {
    // If userId is 'me' or matches current user, use /profile/me endpoint
    if (userId === 'me') {
      return api.get('/users/profile/me');
    }
    if (!userId) {
      throw new Error('User ID is required for getProfile');
    }
    return api.get(`/users/${userId}`);
  },
  getCurrentProfile: () => api.get('/users/profile/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserPosts: (userId, page = 1, limit = 10) => {
    if (!userId) {
      throw new Error('User ID is required for getUserPosts');
    }
    return api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  },
  searchUsers: (query, page = 1, limit = 20) => 
    api.get(`/users?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
};

// Post API calls
export const postAPI = {
  createPost: (postData) => api.post('/posts', postData),
  getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  updatePost: (postId, data) => api.put(`/posts/${postId}`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

export const isTokenExpired = (error) => {
  return error.response?.status === 401 || 
         error.response?.data?.error === 'TOKEN_EXPIRED' ||
         error.response?.data?.error === 'INVALID_TOKEN';
};

export default api;
