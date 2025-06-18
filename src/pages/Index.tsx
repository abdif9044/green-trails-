
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import DatabaseEmergencyFix from '@/components/admin/DatabaseEmergencyFix';
import FeaturedTrails from '@/components/home/FeaturedTrails';
import CtaSection from '@/components/home/CtaSection';
import FeatureSection from '@/components/home/FeatureSection';
import AchievementTeaser from '@/components/home/AchievementTeaser';
import { MapPin, Users, Star, Zap, Mountain, Camera, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-luxury-50 dark:from-greentrail-950 dark:via-gray-900 dark:to-luxury-950">
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
        <section className="relative py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-greentrail-100/30 via-transparent to-gold-100/20"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-greentrail-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 to-greentrail-500/20 backdrop-blur-sm border border-gold-200 rounded-full px-6 py-2 mb-8 animate-fade-in">
                <Zap className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-medium text-greentrail-800 dark:text-greentrail-200">
                  Premium Trail Discovery Platform
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-8 animate-fade-in-up">
                Discover Your Next
                <span className="block bg-gradient-to-r from-greentrail-600 via-gold-600 to-greentrail-700 bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                Explore thousands of hiking trails, connect with fellow adventurers, and share your outdoor experiences in our growing community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-greentrail-600 to-greentrail-700 hover:from-greentrail-700 hover:to-greentrail-800 text-white px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/discover">
                    <MapPin className="mr-3 h-6 w-6" />
                    Discover Trails
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-greentrail-600 text-greentrail-600 hover:bg-greentrail-50 dark:hover:bg-greentrail-900 px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/auth">
                    <Users className="mr-3 h-6 w-6" />
                    Join Community
                  </Link>
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up delay-600">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-greentrail-600 mb-2">5,000+</div>
                  <div className="text-gray-600 dark:text-gray-300">Verified Trails</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gold-600 mb-2">15k+</div>
                  <div className="text-gray-600 dark:text-gray-300">Active Hikers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-greentrail-600 mb-2">50k+</div>
                  <div className="text-gray-600 dark:text-gray-300">Trail Photos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Trails Section */}
        <FeaturedTrails />

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-greentrail-50/50 to-gold-50/30 dark:from-greentrail-950/50 dark:to-gold-950/30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                Everything You Need for Your
                <span className="block text-gold-600">Trail Adventures</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From discovering new trails to connecting with fellow hikers, we've got you covered.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: MapPin,
                  title: "Trail Discovery",
                  description: "Explore thousands of trails with detailed maps, difficulty ratings, and real user reviews.",
                  color: "greentrail"
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Connect with fellow adventurers, share experiences, and join group hikes.",
                  color: "gold"
                },
                {
                  icon: Star,
                  title: "Reviews & Ratings",
                  description: "Read honest reviews and contribute your own experiences to help others.",
                  color: "greentrail"
                },
                {
                  icon: Camera,
                  title: "Photo Sharing",
                  description: "Capture and share stunning trail moments with our photo albums feature.",
                  color: "gold"
                },
                {
                  icon: Mountain,
                  title: "Weather Prophet",
                  description: "Get real-time weather updates and forecasts for your planned hikes.",
                  color: "greentrail"
                },
                {
                  icon: Heart,
                  title: "Social Features",
                  description: "Follow friends, create hiking groups, and build your outdoor network.",
                  color: "gold"
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className={`group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    feature.color === 'greentrail' 
                      ? 'from-greentrail-100 to-greentrail-200 dark:from-greentrail-800 dark:to-greentrail-900' 
                      : 'from-gold-100 to-gold-200 dark:from-gold-800 dark:to-gold-900'
                  } rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.color === 'greentrail' ? 'text-greentrail-600' : 'text-gold-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievement Teaser */}
        <AchievementTeaser />

        {/* Feature Sections */}
        <FeatureSection />

        {/* CTA Section */}
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
