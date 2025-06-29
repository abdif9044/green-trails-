
import * as React from 'react';
import { AchievementTeaser } from '@/components/home/AchievementTeaser';
import { useBadges } from '@/hooks/use-badges';
import { useAuth } from '@/hooks/use-auth';

const HomeAchievements: React.FC = () => {
  const { user } = useAuth();
  const { badges, loading } = useBadges();

  if (user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <AchievementTeaser badges={badges} loading={loading} />
      </div>
    </div>
  );
};

export default HomeAchievements;
