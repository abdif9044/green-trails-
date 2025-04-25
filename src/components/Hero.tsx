
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Compass } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950">
      <div className="absolute inset-0 opacity-20 bg-[url('/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png')] bg-no-repeat bg-right-top bg-contain"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-greentrail-900 dark:text-greentrail-100 mb-6">
            Explore Trails<br />
            <span className="text-greentrail-600">Share Experiences</span>
          </h1>
          
          <p className="text-lg md:text-xl text-greentrail-800 dark:text-greentrail-300 mb-8 max-w-2xl">
            Discover cannabis-friendly trails, connect with like-minded adventurers, and share your outdoor experiences in a welcoming community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-6 py-6 text-lg rounded-full">
              <Link to="/discover">
                <Compass className="mr-2" size={20} />
                Discover Trails
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800 px-6 py-6 text-lg rounded-full">
              <Link to="/auth?signup=true">
                Join GreenTrails
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-3/4">
        <img 
          src="/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png" 
          alt="Roamie Mascot" 
          className="object-contain h-full"
        />
      </div>
    </div>
  );
};

export default Hero;
