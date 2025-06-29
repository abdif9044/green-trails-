
import * as React from 'react';
import HomeContent from '@/components/home/HomeContent';
import HomeEasterEggs from '@/components/home/HomeEasterEggs';
import HomeAchievements from '@/components/home/HomeAchievements';
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
