
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import FeatureSection from '@/components/home/FeatureSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import FloatingRoamie from '@/components/FloatingRoamie';
import { useBadges } from '@/hooks/use-badges';

const HomePage: React.FC = () => {
  const { badges, loading } = useBadges();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEOProvider 
        title="GreenTrails - Discover Cannabis-Friendly Hiking Adventures"
        description="Find the best hiking trails with a community that celebrates both nature and cannabis culture. Discover, share, and explore responsibly."
      />
      
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedTrails />
        <FeatureSection />
        <CtaSection />
      </main>
      
      <Footer />
      <FloatingRoamie />
    </div>
  );
};

export default HomePage;
