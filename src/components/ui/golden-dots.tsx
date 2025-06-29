
import React from 'react';

interface GoldenDotsProps {
  variant?: 'small' | 'medium' | 'large';
  count?: number;
  animated?: boolean;
  className?: string;
}

export const GoldenDots: React.FC<GoldenDotsProps> = ({ 
  variant = 'medium', 
  count = 3,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-1.5 h-1.5',
    large: 'w-2 h-2'
  };

  const spacingClasses = {
    small: 'gap-1',
    medium: 'gap-1.5',
    large: 'gap-2'
  };

  return (
    <div className={`flex items-center ${spacingClasses[variant]} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`${sizeClasses[variant]} bg-yellow-400 rounded-full ${animated ? 'animate-pulse' : ''}`}
          style={animated ? { animationDelay: `${index * 0.5}s` } : {}}
        />
      ))}
    </div>
  );
};

export default GoldenDots;
