
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CloudSun, Leaf, Zap } from 'lucide-react';
import { StrainTag } from '@/types/trails';

interface StrainPairingProps {
  strainTags: StrainTag[];
  trailDifficulty: string;
  trailLength: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';
}

const StrainPairingSystem: React.FC<StrainPairingProps> = ({
  strainTags = [],
  trailDifficulty,
  trailLength,
  timeOfDay = 'any'
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(timeOfDay);

  // Helper to determine recommended strains based on factors
  const getRecommendedStrains = (time: string): StrainTag[] => {
    if (strainTags.length === 0) {
      return [];
    }
    
    // Filter strains based on difficulty and time of day
    let filtered = [...strainTags];
    
    if (time === 'morning') {
      // Morning - prefer energizing sativas for difficult trails
      if (trailDifficulty === 'hard' || trailDifficulty === 'expert') {
        filtered = filtered.filter(strain => 
          strain.type === 'sativa' || 
          (strain.effects && strain.effects.some(e => 
            ['energetic', 'focused', 'uplifted'].includes(e.toLowerCase())
          ))
        );
      }
    } else if (time === 'afternoon') {
      // Afternoon - balanced hybrids work well
      filtered = filtered.filter(strain => 
        strain.type === 'hybrid' || 
        (strain.effects && strain.effects.some(e => 
          ['relaxed', 'creative', 'happy'].includes(e.toLowerCase())
        ))
      );
    } else if (time === 'evening') {
      // Evening - indicas for relaxation after hike
      filtered = filtered.filter(strain => 
        strain.type === 'indica' || 
        (strain.effects && strain.effects.some(e => 
          ['relaxed', 'sleepy', 'calm'].includes(e.toLowerCase())
        ))
      );
    }
    
    // If too few results after filtering, return original list
    return filtered.length > 0 ? filtered : strainTags;
  };

  const recommendedStrains = getRecommendedStrains(selectedTime);

  const getStrainTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sativa': return 'bg-green-500 hover:bg-green-600';
      case 'indica': return 'bg-purple-500 hover:bg-purple-600';
      case 'hybrid': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-greentrail-600" />
          <span>Strain Pairings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {strainTags.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No strain recommendations available for this trail.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">When are you hiking?</label>
              <Tabs value={selectedTime} onValueChange={setSelectedTime}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="morning" className="flex gap-1 items-center">
                    <CloudSun className="h-4 w-4" />
                    <span>Morning</span>
                  </TabsTrigger>
                  <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                  <TabsTrigger value="evening">Evening</TabsTrigger>
                </TabsList>
                
                <TabsContent value="morning" className="mt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Morning hikes pair well with energizing strains to keep you alert and focused on the trail.
                  </p>
                </TabsContent>
                <TabsContent value="afternoon" className="mt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    For afternoon adventures, balanced hybrids provide the perfect mix of energy and relaxation.
                  </p>
                </TabsContent>
                <TabsContent value="evening" className="mt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Evening trails call for relaxing strains to wind down while enjoying sunset views.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <Zap className="h-4 w-4 text-greentrail-500" />
                Recommended Strains
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {recommendedStrains.map((strain, idx) => (
                  <div key={idx} className="relative group">
                    <Badge 
                      className={`${getStrainTypeColor(strain.type)} cursor-pointer`}
                    >
                      {strain.name}
                    </Badge>
                    
                    <div className="absolute z-50 bottom-full mb-2 left-0 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <h5 className="font-bold mb-1">{strain.name}</h5>
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline">{strain.type}</Badge>
                        {strain.effects?.slice(0, 2).map((effect, i) => (
                          <Badge key={i} variant="secondary">{effect}</Badge>
                        ))}
                      </div>
                      {strain.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">{strain.description}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {recommendedStrains.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No specific recommendations for this combination.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StrainPairingSystem;
