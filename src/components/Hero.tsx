
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, ChevronDown } from 'lucide-react';
import { useEnhancedAuth } from '@/providers/enhanced-auth-provider';

const Hero = () => {
  const { user } = useEnhancedAuth();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 luxury-pattern opacity-30"></div>
        <div className="absolute inset-0 hero-overlay"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl animate-luxury-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-greentrail-500/10 rounded-full blur-3xl animate-luxury-pulse delay-1000"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-12 animate-fade-in-scale">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo" 
              className="h-20 w-auto mx-auto drop-shadow-2xl"
            />
          </div>
          
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl luxury-heading text-white mb-6 leading-none">
              Blaze
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl luxury-heading bg-gold-gradient bg-clip-text text-transparent mb-8 leading-none">
              Your Path
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="mb-16 animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl lg:text-3xl luxury-text text-luxury-100 max-w-4xl mx-auto leading-relaxed font-light">
              Where nature meets community. Discover extraordinary trails, connect with fellow adventurers, and elevate your outdoor experience.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="mb-16 animate-fade-in-up delay-500">
            <Button asChild className="gold-button text-lg md:text-xl px-12 py-6 rounded-full shadow-gold hover:shadow-gold-lg group">
              <Link to={user ? "/discover" : "/auth"}>
                <Compass className="mr-3 group-hover:rotate-90 transition-transform duration-500" size={24} />
                Begin Your Journey
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );
};

export default Hero;
