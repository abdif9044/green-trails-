
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { Trail } from '@/types/trails';

const mockFeaturedTrails: Trail[] = [
  {
    id: '1',
    name: 'Angels Landing',
    location: 'Zion National Park, Utah',
    imageUrl: '/placeholder.svg',
    difficulty: 'hard' as const,
    length: 5.4,
    elevation: 1488,
    elevation_gain: 1488,
    tags: ['mountain views', 'challenging', 'chains section'],
    likes: 2847,
    description: 'One of the most famous and thrilling hikes in Zion.',
    coordinates: [37.2692, -112.9481] as [number, number]
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
    tags: ['granite dome', 'cables', 'permits required'],
    likes: 3124,
    description: 'Iconic granite dome with cables for the final ascent.',
    coordinates: [37.7459, -119.5332] as [number, number]
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
    tags: ['alpine lake', 'family friendly', 'scenic views'],
    likes: 1856,
    description: 'Beautiful alpine lake surrounded by towering peaks.',
    coordinates: [40.3428, -105.6836] as [number, number]
  }
];

const FeaturedTrails = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
            Featured Trails
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover some of the most popular and breathtaking trails from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFeaturedTrails.map((trail) => (
            <Card key={trail.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img 
                  src={trail.imageUrl} 
                  alt={trail.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={getDifficultyColor(trail.difficulty)}>
                      {trail.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{trail.likes} likes</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg line-clamp-1">{trail.name}</h3>
                  
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm line-clamp-1">{trail.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{trail.length} miles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{trail.elevation_gain}ft gain</span>
                    </div>
                  </div>
                  
                  {trail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trail.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrails;
