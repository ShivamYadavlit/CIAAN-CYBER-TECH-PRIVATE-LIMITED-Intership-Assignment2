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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center group">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                MiniLinkedIn
              </span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 touch-target"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary shadow-lg text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
              MiniLinkedIn
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-6 xl:mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search people and posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-md placeholder-gray-400 text-sm sm:text-base"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-2 lg:px-3 xl:px-4 py-2 rounded-xl transition-all duration-300 group touch-target ${
                  isActiveRoute(item.path)
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ${isActiveRoute(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-semibold hidden lg:block">{item.label}</span>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <div className="relative group">
              <Link
                to={`/profile/${user?.id}`}
                className={`flex flex-col items-center space-y-1 px-2 lg:px-3 xl:px-4 py-2 rounded-xl transition-all duration-300 touch-target ${
                  isActiveRoute(`/profile/${user?.id}`)
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActiveRoute(`/profile/${user?.id}`) 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg scale-110' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:shadow-lg group-hover:scale-110'
                }`}>
                  <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="text-xs font-semibold hidden lg:block">Me</span>
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user?.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="block px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
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
              className="p-2 sm:p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 touch-target"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-3 sm:px-4 pt-3 pb-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search people and posts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-sm sm:text-base touch-target"
                />
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 touch-target ${
                    isActiveRoute(item.path)
                      ? 'text-blue-600 bg-blue-50 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}

              <Link
                to={`/profile/${user?.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 touch-target ${
                  isActiveRoute(`/profile/${user?.id}`)
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 touch-target"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Sign Out</span>
              </button>
            </div>

            {/* User Info in Mobile */}
            <div className="border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 bg-gray-50/50">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
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
