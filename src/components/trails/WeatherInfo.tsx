
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Thermometer, 
  Sunrise,
  Sunset,
  Wind, 
  Droplets 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherInfoProps {
  coordinates?: [number, number];
  temperature?: number;
  condition?: string;
  high?: number;
  low?: number;
  precipitation?: string;
  sunrise?: string;
  sunset?: string;
  windSpeed?: string;
  windDirection?: string;
  isLoading?: boolean;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({
  coordinates,
  temperature,
  condition,
  high,
  low,
  precipitation,
  sunrise,
  sunset,
  windSpeed,
  windDirection,
  isLoading = false
}) => {
  const getWeatherIcon = () => {
    if (!condition) return <CloudSun className="h-7 w-7 text-amber-500" />;
    
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain className="h-7 w-7 text-blue-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="h-7 w-7 text-sky-300" />;
    } else if (lowerCondition.includes('cloud')) {
      return <CloudSun className="h-7 w-7 text-gray-500" />;
    } else {
      return <CloudSun className="h-7 w-7 text-amber-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-12 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!temperature && !condition) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            {getWeatherIcon()}
          </div>
          <div className="text-center">
            <div className="text-lg font-medium flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              {temperature !== undefined ? `${temperature}°` : '--'}
            </div>
            <div className="text-sm text-muted-foreground">
              {condition || 'Unknown'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">
              {high !== undefined && low !== undefined 
                ? `${high}° / ${low}°` 
                : '--'}
            </div>
            <div className="text-xs text-muted-foreground">
              <Droplets className="inline-block h-3 w-3 mr-1" />
              {precipitation || 'Precipitation: --'}
            </div>
          </div>
        </div>
        
        {/* Wind information section */}
        {(windSpeed || windDirection) && (
          <div className="mt-2 pt-2 border-t border-border flex items-center justify-center text-sm text-muted-foreground">
            <Wind className="h-3 w-3 mr-1" />
            <span>
              {windSpeed || '--'} 
              {windDirection ? ` ${windDirection}` : ''}
            </span>
          </div>
        )}
        
        {(sunrise || sunset) && (
          <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sunrise className="h-3 w-3" /> {sunrise || '--'}
            </div>
            <div className="flex items-center gap-1">
              <Sunset className="h-3 w-3" /> {sunset || '--'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
