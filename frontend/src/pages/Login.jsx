import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Remove the cleanup effect that might be clearing errors
  // useEffect(() => {
  //   return () => clearError();
  // }, [clearError]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Don't clear authentication errors while typing - let them persist until next submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoLogin = async () => {
    // Clear any previous authentication errors before new attempt
    if (error) {
      clearError();
    }

    setIsSubmitting(true);

    try {
      const result = await login('demo@example.com', 'Demo@1234');
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <div className="flex justify-center items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">in</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">MiniLinkedIn</h1>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Join now
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 w-full max-w-sm sm:max-w-md mx-auto">
        <div className="glass-card modern-shadow p-6 sm:p-8">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 animate-fade-in">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base touch-target ${formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base touch-target ${formErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-target"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-3 xs:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded touch-target"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 touch-target inline-block py-1"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3 sm:py-3.5 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sign in</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={demoLogin}
                disabled={isSubmitting}
                className="w-full btn-secondary flex items-center justify-center space-x-2 py-3 sm:py-3.5 text-sm sm:text-base"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Try Demo Account</span>
              </button>
            </div>
          </form>

          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Email:</strong> demo@example.com<br />
              <strong>Password:</strong> Demo@1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
