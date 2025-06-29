
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
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-lg relative overflow-hidden`}>
        <svg viewBox="0 0 48 48" className="w-full h-full text-white" fill="currentColor">
          {/* Mountain background layers */}
          <path d="M2 36h44l-8-16-8 8-8-12-8 16-12 4z" fill="currentColor" opacity="0.3"/>
          <path d="M4 38h40l-6-12-6 6-6-9-6 12-16 3z" fill="currentColor" opacity="0.5"/>
          <path d="M6 40h36l-4-8-4 4-4-6-4 8-20 2z" fill="currentColor" opacity="0.7"/>
          
          {/* Bear silhouette */}
          <ellipse cx="16" cy="18" rx="2" ry="1.5" opacity="0.9"/>
          <circle cx="20" cy="14" r="3.5" opacity="0.9"/>
          <ellipse cx="24" cy="18" rx="2" ry="1.5" opacity="0.9"/>
          <ellipse cx="20" cy="20" rx="1.5" ry="2" opacity="0.9"/>
          
          {/* Trail path */}
          <path d="M8 42c6-2 12-4 16-2s8 2 16 0" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
        </svg>
        
        {/* Golden data visualization dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-3 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-2 right-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
            <path d="M35 8 L37 12 L39 16 L37 20" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.6"/>
          </svg>
        </div>
      </div>
      <span className="font-bold text-xl text-green-800 dark:text-green-200">
        GreenTrails
      </span>
    </div>
  );
};

export default Logo;
