
import { Compass, MapPin, Users, Heart, Mountain, Star } from "lucide-react";

const FeatureSection = () => {
  return (
    <section className="py-32 bg-luxury-50 dark:bg-luxury-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 luxury-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl luxury-heading text-luxury-900 dark:text-luxury-100 mb-6">
            Crafted for
          </h2>
          <h2 className="text-5xl md:text-6xl luxury-heading bg-gold-gradient bg-clip-text text-transparent mb-8">
            Excellence
          </h2>
          <p className="text-xl luxury-text text-luxury-600 dark:text-luxury-400 max-w-3xl mx-auto leading-relaxed">
            Every detail thoughtfully designed for the discerning outdoor enthusiast
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Main Feature */}
          <div className="lg:col-span-2 luxury-card group cursor-pointer animate-fade-in-up">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                  <MapPin className="w-8 h-8 text-luxury-900" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl luxury-heading text-luxury-900 dark:text-luxury-100 mb-4">
                  Curated Trail Discovery
                </h3>
                <p className="text-lg luxury-text text-luxury-600 dark:text-luxury-400 mb-6 leading-relaxed">
                  Meticulously selected trails that match your sophistication. From hidden gems to legendary paths, every recommendation is crafted for the extraordinary.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gold-500" />
                    <span className="luxury-text text-sm text-luxury-600 dark:text-luxury-400">Premium Locations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5 text-greentrail-500" />
                    <span className="luxury-text text-sm text-luxury-600 dark:text-luxury-400">Exclusive Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Feature */}
          <div className="luxury-card group cursor-pointer animate-fade-in-up delay-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-greentrail-600 flex items-center justify-center shadow-luxury mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl luxury-heading text-luxury-900 dark:text-luxury-100 mb-4">
                Elite Community
              </h3>
              <p className="luxury-text text-luxury-600 dark:text-luxury-400 leading-relaxed">
                Connect with like-minded adventurers who share your passion for excellence and exploration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="luxury-card group cursor-pointer animate-fade-in-up delay-300">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 rounded-lg bg-luxury-gradient flex items-center justify-center shadow-luxury">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl luxury-heading text-luxury-900 dark:text-luxury-100 mb-2">
                  Memorable Experiences
                </h3>
                <p className="luxury-text text-luxury-600 dark:text-luxury-400">
                  Document and share your adventures with sophisticated photo albums and detailed trail journals.
                </p>
              </div>
            </div>
          </div>

          <div className="luxury-card group cursor-pointer animate-fade-in-up delay-400">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
                <Compass className="w-7 h-7 text-luxury-900" />
              </div>
              <div>
                <h3 className="text-xl luxury-heading text-luxury-900 dark:text-luxury-100 mb-2">
                  Precision Navigation
                </h3>
                <p className="luxury-text text-luxury-600 dark:text-luxury-400">
                  Advanced mapping technology with real-time weather and terrain insights for the perfect journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
