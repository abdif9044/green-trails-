
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star } from 'lucide-react';

interface SecretTrail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  secretLevel: 'hidden' | 'legendary' | 'mythical';
  hints: string[];
}

const SECRET_TRAILS: SecretTrail[] = [
  {
    id: 'secret-1',
    name: 'The Developer\'s Path',
    description: 'A mysterious trail that only appears to those who know the ancient codes...',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
    secretLevel: 'hidden',
    hints: ['Look for the Konami Code', 'Console commands hold power', 'Click where others don\'t']
  },
  {
    id: 'secret-2',
    name: 'Cat Dimension Trail',
    description: 'Where all the cats go when they disappear. A purr-fectly hidden adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
    secretLevel: 'legendary',
    hints: ['Activate feline mode', 'Seven clicks reveal secrets', 'Console: cat']
  },
  {
    id: 'secret-3',
    name: 'The Matrix Trail',
    description: 'Follow the white rabbit down this digital rabbit hole.',
    imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=300&fit=crop',
    secretLevel: 'mythical',
    hints: ['There is no spoon', 'Take the red pill', 'Console: matrix']
  }
];

const SecretTrailCard: React.FC<{ trail: SecretTrail }> = ({ trail }) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'hidden': return 'bg-blue-500';
      case 'legendary': return 'bg-purple-500';
      case 'mythical': return 'bg-gold-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={trail.imageUrl}
            alt={trail.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${getBadgeColor(trail.secretLevel)} text-white`}>
              {trail.secretLevel}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              🔮 Secret
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-greentrail-800 dark:text-greentrail-200 mb-2">
            {trail.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {trail.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Hidden Dimension</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>∞ hrs</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>???/5</span>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs font-medium text-greentrail-700 dark:text-greentrail-300 mb-1">
                Hints to unlock:
              </p>
              <div className="space-y-1">
                {trail.hints.map((hint, index) => (
                  <p key={index} className="text-xs text-muted-foreground italic">
                    • {hint}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SecretTrailsList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SECRET_TRAILS.map(trail => (
        <SecretTrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
};

export default SecretTrailCard;
