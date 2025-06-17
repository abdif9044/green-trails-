
import { useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock badges data for now
    const mockBadges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first hike',
        icon: '🥾',
        unlocked: false
      },
      {
        id: '2',
        name: 'Trail Explorer',
        description: 'Complete 10 hikes',
        icon: '🏔️',
        unlocked: false
      },
      {
        id: '3',
        name: 'Mountain Climber',
        description: 'Reach 1000ft elevation gain',
        icon: '⛰️',
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
