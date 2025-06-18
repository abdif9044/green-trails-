
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import DatabaseEmergencyFix from '@/components/admin/DatabaseEmergencyFix';
import { MapPin, Users, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-950 dark:to-gray-900">
      <SEOProvider 
        title="GreenTrails - Discover Amazing Trails"
        description="Explore thousands of hiking trails with our comprehensive trail discovery platform"
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Emergency Database Fix Section */}
        <section className="py-8 bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800">
          <div className="container mx-auto px-4">
            <DatabaseEmergencyFix />
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                Discover Your Next
                <span className="text-greentrail-600 dark:text-greentrail-400 block">
                  Adventure
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore thousands of hiking trails, connect with fellow adventurers, and share your outdoor experiences in our growing community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3"
                >
                  <Link to="/discover">
                    <MapPin className="mr-2 h-5 w-5" />
                    Discover Trails
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-greentrail-600 text-greentrail-600 hover:bg-greentrail-50 px-8 py-3"
                >
                  <Link to="/auth">
                    <Users className="mr-2 h-5 w-5" />
                    Join Community
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
                Everything You Need for Your Trail Adventures
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From discovering new trails to connecting with fellow hikers, we've got you covered.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-greentrail-100 dark:bg-greentrail-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-greentrail-600" />
                </div>
                <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                  Trail Discovery
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Explore thousands of trails with detailed maps, difficulty ratings, and real user reviews.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-greentrail-100 dark:bg-greentrail-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-greentrail-600" />
                </div>
                <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                  Community
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with fellow adventurers, share experiences, and join group hikes.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-greentrail-100 dark:bg-greentrail-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-greentrail-600" />
                </div>
                <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                  Reviews & Ratings
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Read honest reviews and contribute your own experiences to help others.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
