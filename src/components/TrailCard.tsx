
import { Heart, MapPin, Users, Cannabis } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { TrailDifficulty } from '@/hooks/use-trails';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: readonly string[] | string[]; // Updated to accept readonly arrays
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
  const getDifficultyColor = (difficulty: TrailDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'moderate': return 'bg-blue-500';
      case 'hard': return 'bg-red-500';
      case 'expert': return 'bg-black';
      default: return 'bg-gray-500';
    }
  };

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
            <Badge className={`${getDifficultyColor(difficulty)} text-white capitalize`}>
              {difficulty}
            </Badge>
            
            {isAgeRestricted && (
              <Badge className="bg-purple-600 text-white">
                21+
              </Badge>
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
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-sm">
            <span className="text-greentrail-600 dark:text-greentrail-400">Length</span>
            <p className="font-medium text-greentrail-800 dark:text-greentrail-200">{length} miles</p>
          </div>
          <div className="text-sm">
            <span className="text-greentrail-600 dark:text-greentrail-400">Elevation</span>
            <p className="font-medium text-greentrail-800 dark:text-greentrail-200">{elevation} ft</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <div className="flex flex-wrap gap-1">
          {/* Regular tags */}
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-greentrail-50 text-greentrail-600 border-greentrail-200 hover:bg-greentrail-100 dark:bg-greentrail-900 dark:text-greentrail-300 dark:border-greentrail-700">
              {tag}
            </Badge>
          ))}
          
          {/* Strain tags */}
          {strainTags && strainTags.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
                      "dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
                      "flex items-center gap-1 cursor-help"
                    )}
                  >
                    <Cannabis className="h-3 w-3" />
                    <span>{strainTags.length > 1 ? `${strainTags.length} strains` : strainTags[0]}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 p-1">
                    <p className="font-medium text-xs">Recommended Strains:</p>
                    <div className="flex flex-wrap gap-1">
                      {strainTags.map((strain, idx) => (
                        <span key={idx} className="text-xs">{strain}</span>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrailCard;
