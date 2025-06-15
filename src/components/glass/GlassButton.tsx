
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends ButtonProps {
  glassVariant?: 'primary' | 'secondary' | 'accent';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  className,
  glassVariant = 'primary',
  children,
  ...props
}) => {
  const glassClasses = {
    primary: "bg-greentrail-500/20 hover:bg-greentrail-500/30 backdrop-blur-md border border-greentrail-400/30 text-greentrail-100 shadow-glass-md hover:shadow-glass-lg",
    secondary: "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-glass-md hover:shadow-glass-lg",
    accent: "bg-gold-500/20 hover:bg-gold-500/30 backdrop-blur-md border border-gold-400/30 text-gold-100 shadow-glass-md hover:shadow-glass-lg"
  };

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-105",
        glassClasses[glassVariant],
        className
      )}
      {...props}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </Button>
  );
};
