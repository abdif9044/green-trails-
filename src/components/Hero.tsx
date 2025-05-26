
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950">
      <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-greentrail-900 dark:text-greentrail-100 mb-6">
            Blaze Your Path
          </h1>
          
          <p className="text-xl md:text-2xl text-greentrail-700 dark:text-greentrail-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow nature lovers, discover amazing trails, and share your outdoor experiences through photos and stories.
          </p>
          
          <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Link to={user ? "/discover" : "/auth"}>
              <Compass className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={20} />
              Start Your Journey
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
