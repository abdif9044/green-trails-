
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy' | 'ultra';
  depth?: 1 | 2 | 3 | 4 | 5;
  animated?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className,
  variant = 'medium',
  depth = 2,
  animated = true
}) => {
  const baseClasses = "relative overflow-hidden";
  
  const variantClasses = {
    light: "bg-white/5 backdrop-blur-sm border border-white/10",
    medium: "bg-white/10 backdrop-blur-md border border-white/15",
    heavy: "bg-white/15 backdrop-blur-lg border border-white/20",
    ultra: "bg-white/20 backdrop-blur-xl border border-white/25"
  };
  
  const depthClasses = {
    1: "shadow-glass-sm",
    2: "shadow-glass-md", 
    3: "shadow-glass-lg",
    4: "shadow-glass-xl",
    5: "shadow-glass-2xl"
  };
  
  const animationClasses = animated ? "transition-all duration-500 hover:bg-white/15 hover:shadow-glass-hover" : "";
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        depthClasses[depth],
        animationClasses,
        className
      )}
    >
      {/* Glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
