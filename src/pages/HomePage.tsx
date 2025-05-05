
import React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      <FeaturedTrails />
      <CtaSection />
    </div>
  );
};

export default HomePage;
