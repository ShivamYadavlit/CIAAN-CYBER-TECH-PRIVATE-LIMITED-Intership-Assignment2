import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-linkedin-blue',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}>
    </div>
  );
};

export default LoadingSpinner;
