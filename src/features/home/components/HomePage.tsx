import * as React from 'react';
import HomeContent from './HomeContent';
import HomeEasterEggs from '@/components/home/HomeEasterEggs';
import HomeAchievements from './HomeAchievements';
import { useAuth } from '@/hooks/use-auth';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <>
      <HomeContent />
      {!user && (
        <>
          <HomeEasterEggs />
          <HomeAchievements />
        </>
      )}
    </>
  );
};

export default HomePage;