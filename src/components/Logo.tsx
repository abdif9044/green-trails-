
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-lg`}>
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="currentColor">
          {/* Mountain/trail path */}
          <path d="M2 20h20l-4-8-4 4-4-6-4 8-4 2z" opacity="0.8"/>
          {/* Bear silhouette */}
          <circle cx="8" cy="8" r="1.5" opacity="0.9"/>
          <circle cx="10" cy="6" r="2" opacity="0.9"/>
          <circle cx="12" cy="8" r="1.5" opacity="0.9"/>
          {/* Data visualization dots */}
          <circle cx="16" cy="10" r="1" opacity="0.6"/>
          <circle cx="18" cy="8" r="1" opacity="0.6"/>
          <circle cx="20" cy="12" r="1" opacity="0.6"/>
        </svg>
      </div>
      <span className="font-bold text-xl text-green-800 dark:text-green-200">
        GreenTrails
      </span>
    </div>
  );
};

export default Logo;
