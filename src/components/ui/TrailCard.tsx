
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mountain, Timer, TrendingUp } from 'lucide-react';
import { GoldenDots } from './golden-dots';

interface TrailCardProps {
  trail: {
    id: string;
    name: string;
    location: string;
    difficulty: string;
    length: number;
    elevation_gain?: number;
    imageUrl?: string;
    likes?: number;
    description?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const TrailCard: React.FC<TrailCardProps> = ({ trail, onClick, className = '' }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className={`trail-card cursor-pointer hover:shadow-xl transition-all duration-300 group relative ${className}`}
      onClick={onClick}
    >
      {/* Golden dots indicator */}
      <div className="absolute top-2 right-2 z-10">
        <GoldenDots variant="small" count={3} />
      </div>

      {trail.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img 
            src={trail.imageUrl} 
            alt={trail.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-greentrail-800 dark:text-greentrail-200 line-clamp-1">
              {trail.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {trail.location}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(trail.difficulty)}>
            {trail.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {trail.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {trail.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span>{trail.length} mi</span>
            </div>
            {trail.elevation_gain && (
              <div className="flex items-center gap-1">
                <Mountain className="h-4 w-4" />
                <span>{trail.elevation_gain} ft</span>
              </div>
            )}
          </div>
          {trail.likes && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{trail.likes}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrailCard;
