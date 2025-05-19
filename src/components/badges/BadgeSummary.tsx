
import React from 'react';
import { Badge } from '@/types/badges';
import { BadgeIcon } from './BadgeIcon';
import { cn } from '@/lib/utils';

interface BadgeSummaryProps {
  badges: Badge[];
  className?: string;
  limit?: number;
}

export const BadgeSummary: React.FC<BadgeSummaryProps> = ({ 
  badges, 
  className,
  limit = 3
}) => {
  // Get only unlocked badges and limit the number
  const unlockedBadges = badges
    .filter(badge => badge.unlocked)
    .slice(0, limit);
  
  const totalUnlocked = badges.filter(badge => badge.unlocked).length;
  const showMore = totalUnlocked > limit;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {unlockedBadges.length > 0 ? (
        <>
          <div className="flex -space-x-2">
            {unlockedBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="w-8 h-8 rounded-full bg-greentrail-50 border-2 border-white dark:border-greentrail-900 dark:bg-greentrail-900/30 flex items-center justify-center"
                title={badge.name}
              >
                <BadgeIcon icon={badge.icon} size={16} />
              </div>
            ))}
          </div>
          
          {showMore && (
            <span className="text-xs text-muted-foreground ml-1">
              +{totalUnlocked - limit} more
            </span>
          )}
        </>
      ) : (
        <div className="text-xs text-muted-foreground">No badges earned yet</div>
      )}
    </div>
  );
};
