
import React from 'react';
import SEOProvider from '@/components/SEOProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingRoamie from '@/components/FloatingRoamie';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Camera, Download, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="GreenTrails - Share Your Nature Adventures"
        description="Connect with fellow nature lovers, share trail photos, discover amazing hikes, and build your outdoor community on GreenTrails."
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950">
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
                Share Your Nature Adventures
              </h1>
              
              <p className="text-xl md:text-2xl text-greentrail-700 dark:text-greentrail-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect with fellow nature lovers, discover amazing trails, and share your outdoor experiences through photos and stories.
              </p>
              
              <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to={user ? "/discover" : "/auth"}>
                  Start Your Journey
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 bg-white dark:bg-greentrail-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-greentrail-900 dark:text-greentrail-100 mb-4">
                Your Nature Social Network
              </h2>
              <p className="text-lg text-greentrail-600 dark:text-greentrail-400 max-w-2xl mx-auto">
                Whether you're a solo hiker, family adventurer, or group explorer, GreenTrails helps you connect with nature and community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Camera size={32} />}
                title="Share Your Adventures"
                description="Create beautiful photo albums from your hikes and nature walks. Tag locations, add stories, and inspire others."
              />
              
              <FeatureCard
                icon={<MapPin size={32} />}
                title="Discover Amazing Trails"
                description="Find family-friendly trails, challenging hikes, and hidden gems recommended by our community of nature lovers."
              />
              
              <FeatureCard
                icon={<Users size={32} />}
                title="Build Your Community"
                description="Follow fellow adventurers, join group hikes, share tips, and build lasting friendships through shared outdoor experiences."
              />
            </div>
          </div>
        </section>

        {/* Social Features Section */}
        <section className="py-20 bg-greentrail-50 dark:bg-greentrail-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-greentrail-900 dark:text-greentrail-100 mb-6">
                  Connect Through Nature
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-greentrail-600 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                        Like & Comment
                      </h3>
                      <p className="text-greentrail-600 dark:text-greentrail-400">
                        Support fellow adventurers by liking their photos and sharing encouragement in the comments.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-greentrail-600 flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                        Rate & Review
                      </h3>
                      <p className="text-greentrail-600 dark:text-greentrail-400">
                        Help others by rating trails and sharing detailed reviews of your hiking experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white dark:bg-greentrail-800 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    For Everyone
                  </h3>
                  <p className="text-greentrail-600 dark:text-greentrail-400 mb-6">
                    Families, solo hikers, photographers, and outdoor enthusiasts of all ages welcome!
                  </p>
                  <div className="text-4xl mb-4">🌲👨‍👩‍👧‍👦🥾</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-greentrail-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Nature is better when shared.
              </h2>
              <p className="text-xl text-greentrail-100 mb-8">
                Join thousands of nature lovers sharing their adventures on GreenTrails.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild className="bg-white text-greentrail-700 hover:bg-greentrail-100 px-8 py-6 text-lg rounded-full shadow-lg">
                  <Link to={user ? "/discover" : "/auth"}>
                    <Download className="mr-2" size={20} />
                    Join GreenTrails – It's Free
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-greentrail-200 mt-6">
                All features included. No subscriptions. Just pure outdoor community.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingRoamie />
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
