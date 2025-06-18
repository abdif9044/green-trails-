
import React from 'react';
import { Badge } from '@/types/badges';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCard } from '@/components/badges/BadgeCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEnhancedAuth } from '@/providers/enhanced-auth-provider';

interface AchievementTeaserProps {
  badges: Badge[];
  loading?: boolean;
}

export const AchievementTeaser: React.FC<AchievementTeaserProps> = ({ 
  badges, 
  loading = false 
}) => {
  const { user } = useEnhancedAuth();
  
  // Get the first 3 unlocked badges or ones closest to being unlocked
  const featuredBadges = [...badges]
    .sort((a, b) => {
      // First sort by unlocked status
      if (a.unlocked !== b.unlocked) {
        return a.unlocked ? -1 : 1;
      }
      
      // For locked badges, sort by progress percentage
      if (!a.unlocked && !b.unlocked) {
        const aProgress = (a.progress || 0) / (a.maxProgress || 1);
        const bProgress = (b.progress || 0) / (b.maxProgress || 1);
        return bProgress - aProgress;
      }
      
      // For unlocked badges, sort by unlockedAt date (newest first)
      if (a.unlockedAt && b.unlockedAt) {
        return b.unlockedAt.getTime() - a.unlockedAt.getTime();
      }
      
      return 0;
    })
    .slice(0, 3);

  return (
    <Card className="border-greentrail-100 dark:border-greentrail-800">
      <CardContent className="pt-6 pb-4 px-4">
        <h3 className="text-lg font-medium mb-4 text-greentrail-800 dark:text-greentrail-200">
          Your Achievements
        </h3>
        
        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading achievements...
          </div>
        ) : user ? (
          <>
            <div className="space-y-3">
              {featuredBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button asChild variant="outline" className="w-full">
                <Link to="/badges">View All Badges</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <p>Sign in to track your achievements</p>
            <Button asChild variant="default" className="mt-4 bg-greentrail-600 hover:bg-greentrail-700">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
