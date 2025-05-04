
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950 geometric-pattern">
      <div className="absolute inset-0 opacity-20 bg-[url('/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png')] bg-no-repeat bg-right-top bg-contain"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <div className="mb-8 inline-block">
            <div className="freemason-border p-2">
              <img 
                src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
                alt="GreenTrails Logo" 
                className="h-16 w-auto"
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-greentrail-900 dark:text-greentrail-100 mb-6">
            Blaze Your Path<br />
            <span className="text-greentrail-600">Find Your Peace</span>
          </h1>
          
          <p className="text-lg md:text-xl text-greentrail-800 dark:text-greentrail-300 mb-8 max-w-2xl">
            Join our sacred circle of trail explorers. Connect with nature and like-minded souls on cannabis-friendly paths across the land.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-6 py-6 text-lg rounded-full group transition-all duration-300 hover:shadow-lg hover:shadow-greentrail-600/20">
              <Link to="/discover">
                <Compass className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={20} />
                Explore Trails
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-2 border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800 px-6 py-6 text-lg rounded-full hover:shadow-lg hover:shadow-greentrail-600/10">
              <Link to="/auth?signup=true">
                Join the Circle
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-3/4">
        <img 
          src="/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png" 
          alt="Roamie Mascot" 
          className="object-contain h-full transform hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default Hero;
