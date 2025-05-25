
import React from 'react';
import SEOProvider from '@/components/SEOProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Heart, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="GreenTrails - Blaze Your Path"
        description="Your social hiking app for cannabis-friendly adventures, trail sharing, and community-powered exploration."
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950">
          <div className="absolute inset-0 opacity-20 bg-[url('/lovable-uploads/f1f69aac-d6e2-4389-8835-f83b42f87d98.png')] bg-no-repeat bg-right-top bg-contain"></div>
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
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
                GreenTrails is your social hiking app for cannabis-friendly adventures, trail sharing, and community-powered exploration.
              </p>
              
              <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to={user ? "/discover" : "/auth"}>
                  Start Exploring
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 bg-white dark:bg-greentrail-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <FeatureCard
                icon={<MapPin size={32} />}
                title="Find Trails"
                description="Discover outdoor spots curated by fellow explorers."
              />
              
              <FeatureCard
                icon={<Users size={32} />}
                title="Join the Community"
                description="Like, comment, follow, and share photo albums."
              />
              
              <FeatureCard
                icon={<Heart size={32} />}
                title="Vibe Your Way"
                description="Optional strain tags, playlists, and mood-based trail suggestions."
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-greentrail-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Nature hits different when you're in good company.
              </h2>
              <p className="text-xl text-greentrail-100 mb-8">
                Join GreenTrails.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild className="bg-white text-greentrail-700 hover:bg-greentrail-100 px-8 py-6 text-lg rounded-full shadow-lg">
                  <Link to={user ? "/discover" : "/auth"}>
                    <Download className="mr-2" size={20} />
                    Get the App – It's Free
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-greentrail-200 mt-6">
                All features unlocked. No premium tiers. Just pure exploration.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="text-center group">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-300 mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-3">
      {title}
    </h3>
    <p className="text-greentrail-600 dark:text-greentrail-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Index;
