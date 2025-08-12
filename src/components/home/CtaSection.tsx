
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Crown } from "lucide-react";

const CtaSection = () => {
  const { user } = useAuth();
  
  // Don't render if user is logged in
  if (user) {
    return null;
  }
  
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-luxury-gradient"></div>
        <div className="absolute inset-0 luxury-pattern opacity-20"></div>
        
        {/* Animated Elements */}
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl animate-luxury-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-greentrail-500/10 rounded-full blur-3xl animate-luxury-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          {/* Crown Icon */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold mx-auto">
              <Crown className="w-8 h-8 text-luxury-900" />
            </div>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-5xl md:text-6xl luxury-heading text-white mb-6 leading-tight">
            Begin Your
          </h2>
          <h2 className="text-5xl md:text-6xl luxury-heading bg-gold-gradient bg-clip-text text-transparent mb-8 leading-tight">
            Legacy
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl luxury-text text-luxury-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join an exclusive community of outdoor enthusiasts who demand excellence in every adventure. Your extraordinary journey awaits.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/auth?signup=true">
              <Button className="gold-button text-lg group">
                <span>Create Your Account</span>
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </Button>
            </Link>
            
            <div className="text-luxury-400 luxury-text">
              <span className="text-sm">Always free • Premium experience</span>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400 luxury-text mb-1">21+</div>
                <div className="text-sm text-luxury-400 luxury-text">Age Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400 luxury-text mb-1">100%</div>
                <div className="text-sm text-luxury-400 luxury-text">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400 luxury-text mb-1">∞</div>
                <div className="text-sm text-luxury-400 luxury-text">Endless Adventures</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
