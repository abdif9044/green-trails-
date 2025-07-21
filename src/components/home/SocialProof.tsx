import React from 'react';
import { Star, MapPin, Users, Camera } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Mountain Photographer",
      avatar: "👩‍🎨",
      quote: "GreenTrails helped me discover trails I never knew existed! The AI recommendations are spot-on for finding photogenic hidden gems.",
      rating: 5,
      location: "Colorado Rockies"
    },
    {
      name: "Mike Rodriguez",
      role: "Solo Hiker",
      avatar: "🧗‍♂️",
      quote: "Finally, an app that makes me feel truly safe on remote trails. The real-time safety features and offline maps are game-changers.",
      rating: 5,
      location: "Pacific Crest Trail"
    },
    {
      name: "Emily & Jake",
      role: "Adventure Couple",
      avatar: "👫",
      quote: "The community features helped us connect with local hiking groups. We've made lifelong friends through GreenTrails!",
      rating: 5,
      location: "Appalachian Mountains"
    },
    {
      name: "David Park",
      role: "Weekend Warrior",
      avatar: "🥾",
      quote: "The 3D trail previews save me so much time planning. I know exactly what to expect before I even leave home.",
      rating: 5,
      location: "Yosemite National Park"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "100,000+",
      label: "Active Explorers",
      description: "Join a growing community of passionate hikers"
    },
    {
      icon: MapPin,
      number: "20,003",
      label: "Verified Trails",
      description: "Curated and maintained by our expert team"
    },
    {
      icon: Star,
      number: "4.9★",
      label: "App Store Rating",
      description: "Highest rated hiking app with 50K+ reviews"
    },
    {
      icon: Camera,
      number: "1M+",
      label: "Photos Shared",
      description: "Beautiful moments captured and shared"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Explorers Worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Join thousands of hikers who've transformed their outdoor adventures with GreenTrails
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-greentrail-100 dark:bg-greentrail-900 rounded-full flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-greentrail-600 dark:text-greentrail-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-greentrail-600 dark:text-greentrail-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Explorers Are Saying
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real stories from real adventurers who've transformed their hiking experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-3 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;