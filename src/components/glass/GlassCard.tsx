
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassIntensity?: 'subtle' | 'medium' | 'strong';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  glassIntensity = 'medium',
  hoverable = true,
  children,
  ...props
}) => {
  const intensityClasses = {
    subtle: "bg-white/5 backdrop-blur-sm border-white/10",
    medium: "bg-white/10 backdrop-blur-md border-white/15", 
    strong: "bg-white/15 backdrop-blur-lg border-white/20"
  };

  const hoverClasses = hoverable ? 
    "hover:bg-white/20 hover:shadow-glass-hover hover:scale-[1.02] hover:-translate-y-1" : 
    "";

  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all duration-500 shadow-glass-md",
        intensityClasses[glassIntensity],
        hoverClasses,
        className
      )}
      {...props}
    >
      {/* Glass gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 shadow-inner shadow-white/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};
