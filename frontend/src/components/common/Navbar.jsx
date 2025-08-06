import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  MessageCircle,
  Users,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/users', icon: Users, label: 'Network' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  if (!isAuthenticated) {
    return (
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                MiniLinkedIn
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary shadow-lg"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
              MiniLinkedIn
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search people and posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md placeholder-gray-400"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-300 group ${
                  isActiveRoute(item.path)
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-all duration-300 ${isActiveRoute(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <div className="relative group">
              <Link
                to={`/profile/${user?.id}`}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActiveRoute(`/profile/${user?.id}`)
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActiveRoute(`/profile/${user?.id}`) 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg scale-110' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:shadow-lg group-hover:scale-110'
                }`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold">Me</span>
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-linkedin-blue hover:bg-gray-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search people and posts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-blue focus:border-transparent transition-all duration-200 bg-gray-50"
                />
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? 'text-linkedin-blue bg-blue-50'
                      : 'text-gray-600 hover:text-linkedin-blue hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <Link
                to={`/profile/${user?.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActiveRoute(`/profile/${user?.id}`)
                    ? 'text-linkedin-blue bg-blue-50'
                    : 'text-gray-600 hover:text-linkedin-blue hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-linkedin-blue hover:bg-gray-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

            {/* User Info in Mobile */}
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linkedin-blue rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
