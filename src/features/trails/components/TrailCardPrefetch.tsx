
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Mountain, MapPin } from "lucide-react";
import { usePrefetch } from '@/hooks/use-prefetch';
import { StrainTag, Trail, TrailDifficulty } from '@/types/trails';
import { TrailTagsList } from './TrailTagsList';

type TrailCardPrefetchProps = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: readonly string[] | string[];
  likes: number;
  coordinates?: [number, number];
  strainTags?: string[] | StrainTag[];
  isAgeRestricted: boolean;
  description?: string;
};

// Helper function to get badge color based on difficulty
const getDifficultyColor = (difficulty: TrailDifficulty) => {
  switch(difficulty) {
    case 'easy': 
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'expert':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

const TrailCardPrefetch: React.FC<TrailCardPrefetchProps> = ({
  id,
  name,
  location,
  imageUrl,
  difficulty,
  length,
  elevation,
  tags,
  likes,
  coordinates,
  strainTags,
  isAgeRestricted
}) => {
  const { prefetchTrail, prefetchSimilarTrails, prefetchWeatherData } = usePrefetch();
  
  // Start prefetching data when hovering over the card
  const handleMouseEnter = () => {
    prefetchTrail(id);
    prefetchSimilarTrails(id);
    if (coordinates) {
      prefetchWeatherData(id, coordinates);
    }
  };
  
  return (
    <Link 
      to={`/trail/${id}`}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {isAgeRestricted && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                21+
              </Badge>
            )}
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-bold text-greentrail-800 dark:text-greentrail-200 text-lg mb-2">{name}</h3>
          <p className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-greentrail-50 dark:bg-greentrail-900">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-border pt-3 pb-3">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center">
              <Mountain className="h-4 w-4 mr-1" />
              {elevation} ft • {length} mi
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {likes}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TrailCardPrefetch;
