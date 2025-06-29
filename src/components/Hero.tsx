
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
            Discover Your Next
            <span className="block text-greentrail-600 dark:text-greentrail-400 relative">
              Adventure
              <div className="absolute -top-2 -right-4">
                <GoldenDots variant="medium" count={2} />
              </div>
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the community of outdoor enthusiasts. Find trails, share experiences, 
            and connect with fellow hikers on your journey to explore nature.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!user ? (
              <>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3 text-lg relative"
                    showGoldenDots
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/discover">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-greentrail-300 text-greentrail-700 hover:bg-greentrail-50 px-8 py-3 text-lg"
                    showGoldenDots
                  >
                    Explore Trails
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/discover">
                <Button 
                  size="lg" 
                  className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3 text-lg"
                  showGoldenDots
                >
                  Discover Trails
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute top-2 right-2">
                <GoldenDots variant="small" count={2} />
              </div>
              <Map className="h-12 w-12 text-greentrail-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Interactive Maps
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Explore detailed trail maps with elevation profiles and real-time conditions
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute top-2 right-2">
                <GoldenDots variant="small" count={2} />
              </div>
              <Users className="h-12 w-12 text-greentrail-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Social Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Connect with fellow hikers and share your outdoor experiences
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute top-2 right-2">
                <GoldenDots variant="small" count={2} />
              </div>
              <Camera className="h-12 w-12 text-greentrail-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Photo Albums
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Capture and share your adventures with beautiful photo albums
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
