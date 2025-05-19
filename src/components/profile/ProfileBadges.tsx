
import React from 'react';
import { Badge } from '@/types/badges';
import { BadgeSummary } from '@/components/badges/BadgeSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProfileBadgesProps {
  badges: Badge[];
  loading?: boolean;
}

export const ProfileBadges: React.FC<ProfileBadgesProps> = ({ 
  badges,
  loading = false
}) => {
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const totalBadges = badges.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Achievements</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/badges">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            {unlockedBadges.length} of {totalBadges} badges earned
          </div>
          <div className="text-sm font-medium">
            {Math.round((unlockedBadges.length / totalBadges) * 100)}%
          </div>
        </div>
        
        {unlockedBadges.length > 0 ? (
          <div className="space-y-3">
            {unlockedBadges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-greentrail-50 dark:bg-greentrail-900/30 flex items-center justify-center">
                  <BadgeSummary badges={[badge]} />
                </div>
                <div>
                  <div className="text-sm font-medium">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
              </div>
            ))}
            
            {unlockedBadges.length > 3 && (
              <div className="text-xs text-muted-foreground text-center pt-2">
                + {unlockedBadges.length - 3} more achievements
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <p>No badges earned yet.</p>
            <p className="mt-2">Start exploring trails to earn your first badge!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
