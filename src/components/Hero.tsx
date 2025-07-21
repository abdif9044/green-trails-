
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Users, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoldenDots } from '@/components/ui/golden-dots';
import { useAuth } from '@/hooks/use-auth';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative bg-gradient-to-br from-greentrail-50 via-white to-greentrail-100 dark:from-greentrail-950 dark:via-gray-900 dark:to-greentrail-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png')] bg-cover bg-center opacity-5"></div>
      
      {/* Golden dots decoration */}
      <div className="absolute top-10 left-10">
        <GoldenDots variant="large" count={4} />
      </div>
      <div className="absolute top-32 right-20">
        <GoldenDots variant="medium" count={3} />
      </div>
      <div className="absolute bottom-20 left-1/4">
        <GoldenDots variant="small" count={5} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
            The Future of
            <span className="block text-greentrail-600 dark:text-greentrail-400 relative">
              Trail Exploration
              <div className="absolute -top-2 -right-4">
                <GoldenDots variant="medium" count={2} />
              </div>
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
            <span className="font-semibold text-greentrail-700 dark:text-greentrail-300">Discover Hidden Gems, Conquer New Heights</span>
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered trail discovery meets real-time safety intelligence. Join 100,000+ explorers using 
            the most advanced hiking companion ever created.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!user ? (
              <>
                <div className="relative">
                  <Link to="/auth">
                    <Button 
                      size="lg" 
                      className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3 text-lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="absolute top-1 right-1">
                    <GoldenDots variant="small" count={2} />
                  </div>
                </div>
                <div className="relative">
                  <Link to="/discover">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-greentrail-300 text-greentrail-700 hover:bg-greentrail-50 px-8 py-3 text-lg"
                    >
                      Explore Trails
                    </Button>
                  </Link>
                  <div className="absolute top-1 right-1">
                    <GoldenDots variant="small" count={2} />
                  </div>
                </div>
              </>
            ) : (
              <div className="relative">
                <Link to="/discover">
                  <Button 
                    size="lg" 
                    className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3 text-lg"
                  >
                    Discover Trails
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="absolute top-1 right-1">
                  <GoldenDots variant="small" count={2} />
                </div>
              </div>
            )}
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-greentrail-600">100K+</span>
              <span>Explorers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-greentrail-600">20K+</span>
              <span>Verified Trails</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-greentrail-600">4.9★</span>
              <span>App Store Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
