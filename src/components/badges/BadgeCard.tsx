
import React from 'react';
import { Badge } from '@/types/badges';
import { BadgeIcon } from './BadgeIcon';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  className?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, className }) => {
  const { name, description, icon, level, unlocked, progress, maxProgress, category } = badge;

  // Calculate progress percentage
  const progressPercentage = progress && maxProgress 
    ? Math.min(Math.round((progress / maxProgress) * 100), 100) 
    : 0;

  // Determine the border and background color based on level
  const getLevelStyles = () => {
    if (!unlocked) return 'border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/30';
    
    switch (level) {
      case 1:
        return 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20';
      case 2:
        return 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20';
      case 3:
        return 'border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md", 
      getLevelStyles(),
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            unlocked 
              ? "bg-greentrail-100 dark:bg-greentrail-900/50" 
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            <BadgeIcon icon={icon} locked={!unlocked} size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "font-medium",
                unlocked ? "text-greentrail-900 dark:text-greentrail-100" : "text-gray-500 dark:text-gray-400"
              )}>
                {name}
              </h3>
              {level && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  unlocked 
                    ? "bg-greentrail-100 text-greentrail-800 dark:bg-greentrail-900/50 dark:text-greentrail-200" 
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  Level {level}
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
            
            {progress !== undefined && maxProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{badge.requirement}</span>
                  <span>{progress} / {maxProgress}</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={unlocked 
                    ? "h-1.5 bg-greentrail-100 dark:bg-greentrail-900/30" 
                    : "h-1.5 bg-gray-100 dark:bg-gray-800"
                  } 
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
