
import React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import { DemoAccountCreator } from '@/components/home/DemoAccountCreator';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-greentrail-800 dark:text-greentrail-200">
          Try GreenTrails Instantly
        </h2>
        <DemoAccountCreator />
      </div>
      <FeaturedTrails />
      <CtaSection />
    </div>
  );
};

export default HomePage;
