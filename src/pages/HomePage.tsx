
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import { AchievementTeaser } from '@/components/home/AchievementTeaser';
import { useBadges } from '@/hooks/use-badges';
import { useAuth } from '@/hooks/use-auth';
import ClickableEasterEgg from '@/components/easter-eggs/ClickableEasterEgg';
import DeveloperConsole from '@/components/easter-eggs/DeveloperConsole';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

const HomePage = () => {
  const { user } = useAuth();
  const { badges, loading } = useBadges();
  const [showDevConsole, setShowDevConsole] = useState(false);
  const { isDevMode, toggleDevMode } = useEasterEggs();
  
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Hidden developer console trigger */}
      {isDevMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <ClickableEasterEgg
            requiredClicks={3}
            message="🔧 Developer Console Activated!"
            action={() => setShowDevConsole(true)}
          >
            <div className="w-4 h-4 bg-green-600 rounded-full opacity-50 hover:opacity-100 transition-opacity" />
          </ClickableEasterEgg>
        </div>
      )}
      
      <FeatureSection />
      
      {!user && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <ClickableEasterEgg
              requiredClicks={5}
              message="🏆 Secret Achievement Unlocked!"
              action={toggleDevMode}
            >
              <h2 className="text-2xl font-bold mb-8 text-greentrail-800 dark:text-greentrail-200 text-center">
                Earn Achievements
              </h2>
            </ClickableEasterEgg>
            <AchievementTeaser badges={badges} loading={loading} />
          </div>
        </div>
      )}
      
      <FeaturedTrails />
      
      {!user && <CtaSection />}
      
      {showDevConsole && (
        <DeveloperConsole onClose={() => setShowDevConsole(false)} />
      )}
    </div>
  );
};

export default HomePage;
