
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOProvider from '@/components/SEOProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Users, 
  Star, 
  Download, 
  Smartphone, 
  Zap, 
  Brain, 
  CloudRain,
  Camera,
  Heart,
  Award,
  TrendingUp,
  Globe,
  Shield,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-luxury-50 dark:from-greentrail-950 dark:via-gray-900 dark:to-luxury-950">
      <SEOProvider 
        title="GreenTrails - Best AI Hiking App 2025 | Smart Trail Discovery with Roamie"
        description="Download GreenTrails, the #1 AI hiking app of 2025. Discover trails with Roamie, your smart outdoor AI companion. Free trail discovery, weather forecasts, and personalized hiking recommendations."
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Product Focused */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-greentrail-100/30 via-transparent to-gold-100/20"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-greentrail-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-greentrail-500 to-gold-500 text-white px-6 py-2 text-lg">
                🏆 Best Hiking App 2025
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                Meet <span className="text-gold-600">GreenTrails</span>
                <br />
                <span className="text-3xl md:text-5xl">The AI Hiking Revolution</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
                Discover trails with <strong>Roamie AI</strong> - your smart hiking assistant that remembers your preferences, 
                predicts weather, and finds your perfect outdoor adventure. 100% Free Forever.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-greentrail-600 to-greentrail-700 hover:from-greentrail-700 hover:to-greentrail-800 text-white px-8 py-4 text-lg">
                  <Download className="mr-2 h-6 w-6" />
                  Download GreenTrails - Free
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-greentrail-600 text-greentrail-600 px-8 py-4 text-lg">
                  <Smartphone className="mr-2 h-6 w-6" />
                  View Demo
                </Button>
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-greentrail-600">500K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-600">50K+</div>
                  <div className="text-gray-600">Trail Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-greentrail-600">4.9★</div>
                  <div className="text-gray-600">App Store Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-600">15K+</div>
                  <div className="text-gray-600">AI Recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roamie AI Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
                  🤖 AI Powered
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                  Meet Roamie: Your Smart Hiking Assistant
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Roamie is the world's first AI hiking companion that remembers your trails, learns your preferences, 
                  and provides personalized outdoor recommendations powered by advanced machine learning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">Smart Memory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Roamie remembers every trail you've hiked, your favorite difficulty levels, and preferred weather conditions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <CloudRain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">Weather Prophet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Get real-time weather predictions and trail condition updates powered by AI weather analysis.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <MapPin className="h-12 w-12 text-greentrail-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">Personalized Discovery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Discover new trails tailored to your hiking style, fitness level, and adventure preferences.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* App Screenshots Mockup */}
        <section className="py-20 bg-gradient-to-br from-greentrail-50 to-gold-50 dark:from-greentrail-950 dark:to-gold-950">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-12">
                Experience the Future of Hiking
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <div className="w-full h-64 bg-gradient-to-br from-greentrail-100 to-greentrail-200 rounded-xl mb-4 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-greentrail-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trail Discovery</h3>
                  <p className="text-gray-600 dark:text-gray-300">AI-powered trail recommendations</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 flex items-center justify-center">
                    <Brain className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Roamie Chat</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your personal hiking assistant</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                  <div className="w-full h-64 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gold-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-600 dark:text-gray-300">Connect with fellow adventurers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                  What Hikers Are Saying
                </h2>
                <div className="flex justify-center items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-gold-500 text-gold-500" />
                  ))}
                  <span className="text-xl font-semibold ml-2">4.9/5 Average Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      "GreenTrails completely changed how I explore. Roamie remembers my favorite hikes, gives real-time weather tips, and even recommends trails based on my mood. It's like having a trail buddy who knows me better than I know myself."
                    </p>
                    <div className="font-semibold">Sierra B.</div>
                    <div className="text-sm text-gray-500">Oregon Hiker & Photographer</div>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      "This is the smartest hiking app I've ever used. GreenTrails doesn't just show you trails—it learns from your adventures. The AI assistant Roamie makes personalized recommendations, tracks progress, and keeps you motivated. Easily the best outdoor companion app of 2025."
                    </p>
                    <div className="font-semibold">Alex D.</div>
                    <div className="text-sm text-gray-500">Product Designer & Weekend Explorer</div>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic text-xl">
                      "GreenTrails is AllTrails with a brain—and a heart."
                    </p>
                    <div className="font-semibold">Jenna M.</div>
                    <div className="text-sm text-gray-500">Trail Runner</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-br from-greentrail-50 to-gold-50 dark:from-greentrail-950 dark:to-gold-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                100% Free Forever
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                Unlike other hiking apps, GreenTrails is completely free with no hidden costs or premium tiers.
              </p>

              <Card className="max-w-2xl mx-auto p-8 shadow-lg border-2 border-greentrail-200">
                <CardHeader className="text-center">
                  <Badge className="mb-4 bg-gradient-to-r from-greentrail-500 to-gold-500 text-white px-6 py-2 text-lg mx-auto">
                    🎉 Forever Free
                  </Badge>
                  <CardTitle className="text-3xl font-bold">$0</CardTitle>
                  <p className="text-gray-600">No subscriptions, no ads, no limits</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Unlimited trail discovery',
                      'Full Roamie AI assistant access',
                      'Real-time weather predictions',
                      'Community features & photo sharing',
                      'Offline maps & GPS tracking',
                      'Personalized recommendations',
                      'Priority customer support'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-greentrail-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button size="lg" className="w-full bg-gradient-to-r from-greentrail-600 to-greentrail-700 text-white text-lg py-4">
                    <Download className="mr-2 h-6 w-6" />
                    Download Now - Free
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Section - Future of Outdoor Exploration */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
                  📖 Featured Article
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-6">
                  Why GreenTrails is the Future of Outdoor Exploration
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-br from-greentrail-50 to-gold-50 dark:from-greentrail-950 dark:to-gold-950 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    The AI Revolution in Outdoor Recreation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Traditional hiking apps show you trails. GreenTrails understands you. Our breakthrough AI technology, 
                    powered by Roamie, creates a personalized outdoor experience that adapts to your preferences, fitness level, 
                    and adventure goals. This is the beginning of a new era where technology enhances rather than replaces 
                    our connection with nature.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-greentrail-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-greentrail-800 dark:text-greentrail-200">Smart Recommendations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">AI learns from millions of hiker preferences to suggest your perfect trail</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="h-6 w-6 text-greentrail-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-greentrail-800 dark:text-greentrail-200">Sustainable Exploration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Promote responsible hiking with crowd-sourced trail conditions</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-greentrail-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-greentrail-800 dark:text-greentrail-200">Safety First</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Real-time weather alerts and emergency features keep you safe</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Heart className="h-6 w-6 text-greentrail-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-greentrail-800 dark:text-greentrail-200">Community Driven</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with like-minded adventurers and share experiences</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button asChild className="bg-greentrail-600 hover:bg-greentrail-700 text-white">
                      <Link to="/discover">Experience the Future Today</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA Section */}
        <section className="py-20 bg-gradient-to-r from-greentrail-600 to-greentrail-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Hiking Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join over 500,000 hikers who've discovered their perfect trails with GreenTrails and Roamie AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-white text-greentrail-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Download className="mr-2 h-6 w-6" />
                  Download for iOS
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-greentrail-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <Download className="mr-2 h-6 w-6" />
                  Download for Android
                </Button>
              </div>

              <p className="text-sm opacity-75">
                Available on App Store and Google Play • 100% Free Forever
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
