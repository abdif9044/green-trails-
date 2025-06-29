
import * as React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import { useAuth } from '@/hooks/use-auth';

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      <FeaturedTrails />
      {!user && <CtaSection />}
    </div>
  );
};

export default HomeContent;
