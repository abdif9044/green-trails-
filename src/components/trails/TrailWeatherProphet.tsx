
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles } from 'lucide-react';
import WeatherProphet from '@/components/weather/WeatherProphet';

interface TrailWeatherProphetProps {
  coordinates: [number, number];
  trailData: {
    name?: string;
    difficulty?: string;
    elevation?: number;
    length?: number;
  };
}

const TrailWeatherProphet: React.FC<TrailWeatherProphetProps> = ({ 
  coordinates, 
  trailData 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">AI Weather Intelligence</h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>
      
      <WeatherProphet 
        coordinates={coordinates}
        trailData={trailData}
      />
    </div>
  );
};

export default TrailWeatherProphet;
