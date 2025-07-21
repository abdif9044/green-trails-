
import * as React from 'react';
import Hero from '@/components/Hero';
import ProblemSolution from '@/components/home/ProblemSolution';
import FeatureSection from '@/components/home/FeatureSection';
import SocialProof from '@/components/home/SocialProof';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import CtaSection from '@/components/home/CtaSection';
import { useAuth } from '@/hooks/use-auth';

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemSolution />
      <FeatureSection />
      <SocialProof />
      <FeaturedTrails />
      {!user && <CtaSection />}
    </div>
  );
};

export default HomeContent;
