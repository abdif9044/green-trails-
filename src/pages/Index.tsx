
import React from 'react';
import SEOProvider from '@/components/SEOProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/home/FeatureSection';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import CtaSection from '@/components/home/CtaSection';
import { Button } from '@/components/ui/button';
import { Import } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="GreenTrails - Cannabis-Friendly Hiking & Nature Trails"
        description="Discover the best cannabis-friendly hiking and nature trails. GreenTrails connects you with beautiful paths, strain recommendations, and a community of like-minded explorers."
      />
      
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <FeatureSection />
        <FeaturedTrails />
        <CtaSection />
        
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-block bg-greentrail-50 dark:bg-greentrail-900/50 border border-greentrail-200 dark:border-greentrail-700 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-2">New to GreenTrails?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Need trail data for exploring? Use our auto-import tool to instantly populate the app with trail data.
            </p>
            <Button asChild variant="default" className="bg-greentrail-600 hover:bg-greentrail-700">
              <Link to="/auto-import">
                <Import className="mr-2 h-4 w-4" />
                Auto-Import Trail Data
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
