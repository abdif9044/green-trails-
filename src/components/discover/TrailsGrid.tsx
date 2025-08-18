
import React from 'react';
import { Trail } from '@/types/trails';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface TrailsGridProps {
  trails: Trail[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

const TrailCard: React.FC<{ trail: Trail; index: number }> = ({ trail, index }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { elementRef, isVisible, animationClass } = useScrollAnimation(index);
  
  const handleTrailClick = () => {
    console.log(`TrailsGrid: Navigating to trail ${trail.id}`);
  };

  return (
    <Link to={`/trail/${trail.id}`} onClick={handleTrailClick}>
      <Card 
        ref={elementRef}
        className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
          isVisible ? animationClass : 'card-hidden'
        }`}
      >
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
    </Link>
  );
};

const TrailsGrid: React.FC<TrailsGridProps> = ({
  trails,
  isLoading = false,
  hasNextPage = false,
  onLoadMore
}) => {
  if (isLoading && trails.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trails.map((trail, index) => (
          <TrailCard
            key={trail.id}
            trail={trail}
            index={index}
          />
        ))}
      </div>

      {hasNextPage && onLoadMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-greentrail-600 text-white rounded-lg hover:bg-greentrail-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Load More Trails
          </button>
        </div>
      )}
    </div>
  );
};

export default TrailsGrid;
