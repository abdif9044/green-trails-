import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Touch-optimized button with minimum 44px target size
interface TouchButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const TouchButton: React.FC<TouchButtonProps> = ({ 
  children, 
  className, 
  size = "default",
  ...props 
}) => {
  return (
    <Button
      {...props}
      className={cn(
        // Minimum touch target size (44px)
        "min-h-[44px] min-w-[44px] touch-manipulation",
        // Enhanced touch feedback
        "active:scale-95 transition-transform duration-75",
        // Better spacing for mobile
        "px-6 py-3",
        className
      )}
      size={size}
    >
      {children}
    </Button>
  );
};

// Touch-optimized card container
interface TouchCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TouchCard: React.FC<TouchCardProps> = ({ 
  children, 
  className, 
  onClick 
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // Touch optimizations
        "touch-manipulation",
        "active:scale-[0.98] transition-transform duration-75",
        // Better spacing for mobile
        "p-4 m-2",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Touch-optimized input with better mobile UX
interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TouchInput: React.FC<TouchInputProps> = ({ 
  label, 
  error, 
  className, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          // Base input styles
          "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3",
          "text-base placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Mobile optimizations
          "touch-manipulation",
          // 16px font size to prevent zoom on iOS
          "text-[16px] sm:text-sm",
          error && "border-destructive",
          className
        )}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

// Touch-optimized list item
interface TouchListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TouchListItem: React.FC<TouchListItemProps> = ({
  children,
  onClick,
  className
}) => {
  return (
    <div
      className={cn(
        "flex items-center min-h-[56px] px-4 py-3",
        "touch-manipulation",
        "active:bg-muted transition-colors duration-75",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};