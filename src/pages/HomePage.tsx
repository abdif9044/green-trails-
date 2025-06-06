
import React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import { DemoAccountCreator } from '@/components/home/DemoAccountCreator';
import { AchievementTeaser } from '@/components/home/AchievementTeaser';
import { useBadges } from '@/hooks/use-badges';
import { useAuth } from '@/hooks/use-auth';

const HomePage = () => {
  const { user } = useAuth();
  const { badges, loading } = useBadges();
  
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      
      {!user && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-8 text-greentrail-800 dark:text-greentrail-200">
                Try GreenTrails Instantly
              </h2>
              <DemoAccountCreator />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-8 text-greentrail-800 dark:text-greentrail-200">
                Earn Achievements
              </h2>
              <AchievementTeaser badges={badges} loading={loading} />
            </div>
          </div>
        </div>
      )}
      
      <FeaturedTrails />
      
      {!user && <CtaSection />}
    </div>
  );
};

export default HomePage;
