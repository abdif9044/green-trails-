
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Trail } from '@/types/trails';
import { cn } from '@/lib/utils';

interface TrailCardProps {
  trail: Trail;
  className?: string;
  showLikeButton?: boolean;
  onLike?: (trailId: string) => void;
  isLiked?: boolean;
}

const TrailCard = memo(({ 
  trail, 
  className, 
  showLikeButton = false, 
  onLike, 
  isLiked = false 
}: TrailCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(trail.id);
    }
  };

  return (
    <Link to={`/trails/${trail.id}`}>
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden",
        className
      )}>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-greentrail-100 to-greentrail-200">
            {trail.imageUrl ? (
              <img
                src={trail.imageUrl}
                alt={trail.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-greentrail-400">
                <MapPin size={48} />
              </div>
            )}
          </div>
          
          {showLikeButton && (
            <button
              onClick={handleLikeClick}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full transition-colors",
                isLiked 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
              )}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-greentrail-600 transition-colors">
                {trail.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{trail.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className={getDifficultyColor(trail.difficulty)}>
                {trail.difficulty}
              </Badge>
              
              <div className="flex items-center text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>{trail.length} km</span>
              </div>
              
              {trail.elevation_gain && (
                <div className="flex items-center text-muted-foreground">
                  <TrendingUp size={14} className="mr-1" />
                  <span>{trail.elevation_gain}m</span>
                </div>
              )}
            </div>
            
            {trail.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {trail.description}
              </p>
            )}
            
            {trail.tags && trail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {trail.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {trail.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{trail.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

TrailCard.displayName = 'TrailCard';

export default TrailCard;
