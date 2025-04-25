
import { Heart, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length: number;
  elevation: number;
  tags: string[];
  likes: number;
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
  likes
}: TrailCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
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
          <div className="absolute top-2 right-2">
            <Badge className={`${getDifficultyColor(difficulty)} text-white capitalize`}>
              {difficulty}
            </Badge>
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
      
      <CardFooter className="pt-0 pb-4 flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-greentrail-50 text-greentrail-600 border-greentrail-200 hover:bg-greentrail-100 dark:bg-greentrail-900 dark:text-greentrail-300 dark:border-greentrail-700">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default TrailCard;
