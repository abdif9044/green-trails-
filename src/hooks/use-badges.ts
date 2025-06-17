
import { useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'trails' | 'elevation' | 'social' | 'streak';
  icon: string;
  level: 1 | 2 | 3;
  requirement: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock badges data with all required properties
    const mockBadges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first hike',
        category: 'trails',
        icon: '🥾',
        level: 1,
        requirement: 'Complete 1 hike',
        unlocked: false
      },
      {
        id: '2',
        name: 'Trail Explorer',
        description: 'Complete 10 hikes',
        category: 'trails',
        icon: '🏔️',
        level: 2,
        requirement: 'Complete 10 hikes',
        unlocked: false
      },
      {
        id: '3',
        name: 'Mountain Climber',
        description: 'Reach 1000ft elevation gain',
        category: 'elevation',
        icon: '⛰️',
        level: 1,
        requirement: 'Gain 1000ft elevation',
        unlocked: false
      }
    ];

    setBadges(mockBadges);
    setLoading(false);
  }, []);

  return {
    badges,
    loading,
    refreshBadges: () => {
      // Refresh logic would go here
    }
  };
};
