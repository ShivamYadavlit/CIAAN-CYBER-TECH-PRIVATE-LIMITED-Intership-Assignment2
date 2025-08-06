import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Remove the cleanup effect that might be interfering with navigation
  // useEffect(() => {
  //   return () => clearError();
  // }, [clearError]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[^a-zA-Z\d]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    return { score, feedback };
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
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

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

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

    // Clear any previous authentication errors before new attempt
    if (error) {
      clearError();
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio.trim() || undefined
      });

      if (result.success) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'bg-gray-300';
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return 'Enter password';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
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
          Join our community
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 w-full max-w-sm sm:max-w-md mx-auto">
        <div className="glass-card modern-shadow p-6 sm:p-8">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 animate-fade-in">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base touch-target ${formErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base touch-target ${formErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Missing: {passwordStrength.feedback.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              {formErrors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm sm:text-base touch-target ${formErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-target"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs text-green-600">Passwords match</span>
                </div>
              )}
              {formErrors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none text-sm sm:text-base touch-target ${formErrors.bio ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-center mt-1">
                {formErrors.bio && (
                  <p className="text-xs sm:text-sm text-red-600">{formErrors.bio}</p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.bio.length}/500
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3 sm:py-3.5 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center leading-relaxed">
              By clicking "Create Account", you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 touch-target inline-block">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 touch-target inline-block">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
