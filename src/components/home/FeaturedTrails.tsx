import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, Star } from 'lucide-react';
import { Trail } from '@/types/trails';

const mockFeaturedTrails: Trail[] = [
  {
    id: '1',
    name: 'Angels Landing',
    location: 'Zion National Park, Utah',
    imageUrl: '/placeholder.svg',
    difficulty: 'hard' as const,
    length: 5.4,
    elevation: 5790,
    elevation_gain: 1488,
    latitude: 37.2692,
    longitude: -112.9481,
    tags: ['mountain views', 'challenging', 'chains section'],
    likes: 2847,
    description: 'One of the most famous and thrilling hikes in Zion.',
    coordinates: [-112.9481, 37.2692] as [number, number]
  },
  {
    id: '2', 
    name: 'Half Dome',
    location: 'Yosemite National Park, California',
    imageUrl: '/placeholder.svg',
    difficulty: 'hard' as const,
    length: 16.0,
    elevation: 8842,
    elevation_gain: 4800,
    latitude: 37.7459,
    longitude: -119.5332,
    tags: ['granite dome', 'cables', 'permits required'],
    likes: 3124,
    description: 'Iconic granite dome with cables for the final ascent.',
    coordinates: [-119.5332, 37.7459] as [number, number]
  },
  {
    id: '3',
    name: 'Emerald Lake Trail',
    location: 'Rocky Mountain National Park, Colorado', 
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate' as const,
    length: 3.2,
    elevation: 10110,
    elevation_gain: 605,
    latitude: 40.3428,
    longitude: -105.6836,
    tags: ['alpine lake', 'family friendly', 'scenic views'],
    likes: 1856,
    description: 'Beautiful alpine lake surrounded by towering peaks.',
    coordinates: [-105.6836, 40.3428] as [number, number]
  }
];

const FeaturedTrails = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-greentrail-100 text-greentrail-800 border-greentrail-200';
      case 'moderate': return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-luxury-100 text-luxury-800 border-luxury-200';
    }
  };

  return (
    <section className="py-32 bg-luxury-900 dark:bg-luxury-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full luxury-pattern opacity-10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-greentrail-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl luxury-heading text-white mb-6">
            Signature
          </h2>
          <h2 className="text-5xl md:text-6xl luxury-heading bg-gold-gradient bg-clip-text text-transparent mb-8">
            Collections
          </h2>
          <p className="text-xl luxury-text text-luxury-300 max-w-3xl mx-auto leading-relaxed">
            Handpicked destinations that define extraordinary outdoor experiences
          </p>
        </div>

        {/* Luxury Trail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mockFeaturedTrails.map((trail, index) => (
            <div 
              key={trail.id} 
              className={`group cursor-pointer animate-fade-in-up ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Card className="overflow-hidden bg-white/5 backdrop-blur-luxury border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-luxury-lg h-full">
                <div className={`relative ${index === 0 ? 'aspect-[16/10]' : 'aspect-video'} overflow-hidden`}>
                  <img 
                    src={trail.imageUrl} 
                    alt={trail.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Luxury Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/80 via-transparent to-transparent"></div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getDifficultyColor(trail.difficulty)} border font-luxury font-medium`}>
                      {trail.difficulty}
                    </Badge>
                  </div>
                  
                  {/* Likes */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-luxury-900/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star className="h-4 w-4 text-gold-400 fill-current" />
                      <span className="text-white text-sm luxury-text font-medium">{trail.likes}</span>
                    </div>
                  </div>

                  {/* Trail Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className={`luxury-heading text-white mb-2 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                      {trail.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-luxury-200 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="luxury-text text-sm">{trail.location}</span>
                    </div>
                    
                    {index === 0 && (
                      <p className="text-luxury-300 luxury-text mb-4 leading-relaxed">
                        {trail.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-luxury-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="luxury-text">{trail.length} miles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="luxury-text">{trail.elevation_gain}ft</span>
                      </div>
                    </div>
                    
                    {trail.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {trail.tags.slice(0, index === 0 ? 3 : 2).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-white/10 border-white/20 text-white luxury-text">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-fade-in-up delay-600">
          <button className="gold-button">
            Explore All Collections
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrails;
