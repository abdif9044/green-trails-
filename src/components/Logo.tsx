
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

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Badge Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer dark green circle */}
          <circle cx="50" cy="50" r="48" fill="#166534" stroke="#14532d" strokeWidth="2"/>
          
          {/* Inner light green background */}
          <circle cx="50" cy="50" r="42" fill="#86d086"/>
          
          {/* Background data bars */}
          <rect x="15" y="35" width="3" height="8" fill="#bae5ba" opacity="0.7"/>
          <rect x="20" y="30" width="3" height="13" fill="#bae5ba" opacity="0.7"/>
          <rect x="25" y="25" width="3" height="18" fill="#bae5ba" opacity="0.7"/>
          <rect x="30" y="20" width="3" height="23" fill="#bae5ba" opacity="0.7"/>
          <rect x="75" y="28" width="3" height="15" fill="#bae5ba" opacity="0.7"/>
          <rect x="80" y="32" width="3" height="11" fill="#bae5ba" opacity="0.7"/>
          <rect x="85" y="30" width="3" height="13" fill="#bae5ba" opacity="0.7"/>
          
          {/* Layered mountain ranges */}
          {/* Back mountain layer */}
          <path d="M8 75 L25 45 L35 55 L45 35 L55 50 L65 40 L75 60 L85 45 L92 75 Z" fill="#22c55e" opacity="0.6"/>
          
          {/* Middle mountain layer */}
          <path d="M8 75 L20 50 L30 60 L45 40 L60 55 L75 45 L92 75 Z" fill="#16a34a" opacity="0.8"/>
          
          {/* Front mountain layer */}
          <path d="M8 75 L25 55 L40 65 L55 50 L70 60 L85 55 L92 75 Z" fill="#15803d"/>
          
          {/* Bear silhouette */}
          <path d="M35 55 C33 53 33 50 35 48 C37 46 40 46 42 48 L44 50 C46 48 49 48 51 50 C53 52 53 55 51 57 L50 58 C52 60 52 63 50 65 C48 67 45 67 43 65 L42 64 C40 66 37 66 35 64 C33 62 33 59 35 57 Z" fill="#14532d"/>
          
          {/* Golden trail path */}
          <path d="M25 70 Q40 65 55 70 Q70 75 85 70" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8"/>
          
          {/* Golden data visualization dots and connecting lines */}
          <circle cx="70" cy="25" r="2.5" fill="#fbbf24"/>
          <circle cx="75" cy="35" r="2.5" fill="#fbbf24"/>
          <circle cx="80" cy="45" r="2.5" fill="#fbbf24"/>
          
          {/* Connecting lines between data points */}
          <line x1="70" y1="25" x2="75" y2="35" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8"/>
          <line x1="75" y1="35" x2="80" y2="45" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8"/>
          
          {/* Additional golden accent dots */}
          <circle cx="25" cy="40" r="1.5" fill="#fbbf24" opacity="0.6"/>
          <circle cx="30" cy="35" r="1.5" fill="#fbbf24" opacity="0.6"/>
        </svg>
      </div>
      
      {/* GreenTrails Text */}
      <span className={`font-bold ${textSizeClasses[size]} text-greentrail-800 dark:text-greentrail-200`}>
        GreenTrails
      </span>
    </div>
  );
};

export default Logo;
