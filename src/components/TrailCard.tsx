
import { Heart, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { TrailDifficulty } from '@/types/trails';
import { TrailDifficultyBadge } from './trails/TrailDifficultyBadge';
import { TrailCardStats } from './trails/TrailCardStats';
import { TrailTagsList } from './trails/TrailTagsList';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: readonly string[] | string[];
  likes: number;
  strainTags?: string[];
  isAgeRestricted?: boolean;
}

const TrailCard = ({
  id,
  name,
  location,
  imageUrl,
  difficulty,
  length,
  elevation,
  tags,
  likes,
  strainTags = [],
  isAgeRestricted = false
}: TrailCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 trail-card-shadow border-greentrail-200 dark:border-greentrail-800">
      <Link to={`/trail/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <TrailDifficultyBadge difficulty={difficulty} />
            {isAgeRestricted && (
              <Badge className="bg-purple-600 text-white">21+</Badge>
            )}
          </div>
        </div>
      </Link>
      
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-greentrail-800 dark:text-greentrail-200 text-lg">{name}</h3>
            <div className="flex items-center mt-1 text-sm text-greentrail-600 dark:text-greentrail-400">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center text-greentrail-600 dark:text-greentrail-400">
            <Heart size={16} className="mr-1" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
        
        <TrailCardStats length={length} elevation={elevation} />
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <TrailTagsList tags={tags} strainTags={strainTags} />
      </CardFooter>
    </Card>
  );
};

export default TrailCard;
