
import * as React from 'react';
import Hero from '@/components/Hero';
import ProblemSolution from '@/components/home/ProblemSolution';
import FeatureSection from '@/components/home/FeatureSection';
import SocialProof from '@/components/home/SocialProof';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import CtaSection from '@/components/home/CtaSection';
import Trail3DPreview from '@/components/home/Trail3DPreview';
import WeatherWidget from '@/components/home/WeatherWidget';
import InteractiveMapPreview from '@/components/home/InteractiveMapPreview';
import CommunityActivityFeed from '@/components/home/CommunityActivityFeed';
import AppInstallPrompt from '@/components/home/AppInstallPrompt';
import { useAuth } from '@/hooks/use-auth';

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemSolution />
      
      {/* Advanced UX Features Section */}
      <div className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Experience Trails Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets outdoor adventure. Explore our cutting-edge features that make every hike extraordinary.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Trail3DPreview />
            <WeatherWidget />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <InteractiveMapPreview />
            <CommunityActivityFeed />
          </div>
          
          <AppInstallPrompt />
        </div>
      </div>
      
      <FeatureSection />
      <SocialProof />
      <FeaturedTrails />
      {!user && <CtaSection />}
    </div>
  );
};

export default HomeContent;
