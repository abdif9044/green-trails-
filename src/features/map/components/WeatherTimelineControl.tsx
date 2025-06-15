
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Cloud, 
  CloudRain, 
  CloudSnow,
  Wind,
  Sun
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeatherTimelineControlProps {
  currentTime: number;
  timeRange: { start: number; end: number };
  isAnimating: boolean;
  animationSpeed: number;
  onTimeChange: (time: number) => void;
  onAnimationToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onSkipToTime: (direction: 'forward' | 'backward') => void;
  weatherData?: {
    temperature: number;
    condition: string;
    precipitation: number;
    windSpeed: number;
  };
}

const WeatherTimelineControl: React.FC<WeatherTimelineControlProps> = ({
  currentTime,
  timeRange,
  isAnimating,
  animationSpeed,
  onTimeChange,
  onAnimationToggle,
  onSpeedChange,
  onSkipToTime,
  weatherData
}) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWeatherIcon = () => {
    if (!weatherData) return <Sun className="h-4 w-4" />;
    
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('rain')) return <CloudRain className="h-4 w-4 text-blue-500" />;
    if (condition.includes('snow')) return <CloudSnow className="h-4 w-4 text-blue-300" />;
    if (condition.includes('cloud')) return <Cloud className="h-4 w-4 text-gray-500" />;
    return <Sun className="h-4 w-4 text-yellow-500" />;
  };

  const timePercentage = ((currentTime - timeRange.start) / (timeRange.end - timeRange.start)) * 100;

  return (
    <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 z-20 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        {/* Current Weather Display */}
        {weatherData && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-sm font-medium">{weatherData.temperature}°F</span>
              <Badge variant="outline" className="text-xs">
                {weatherData.condition}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <CloudRain className="h-3 w-3" />
                {weatherData.precipitation}%
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {weatherData.windSpeed} mph
              </div>
            </div>
          </div>
        )}

        {/* Time Display */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-gray-500">
            {formatTime(timeRange.start)} - {formatTime(timeRange.end)}
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[timePercentage]}
            onValueChange={([value]) => {
              const newTime = timeRange.start + (timeRange.end - timeRange.start) * (value / 100);
              onTimeChange(newTime);
            }}
            max={100}
            step={0.1}
            className="w-full"
          />
          
          {/* Time markers */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Now</span>
            <span>+12h</span>
            <span>+24h</span>
            <span>+48h</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSkipToTime('backward')}
              disabled={isAnimating}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={onAnimationToggle}
              className={isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSkipToTime('forward')}
              disabled={isAnimating}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Speed:</span>
            <div className="flex gap-1">
              {[0.5, 1, 2, 4].map(speed => (
                <Button
                  key={speed}
                  size="sm"
                  variant={animationSpeed === speed ? "default" : "outline"}
                  onClick={() => onSpeedChange(speed)}
                  className="text-xs px-2 py-1 h-6"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherTimelineControl;
