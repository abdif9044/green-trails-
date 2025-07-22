import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Eye, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  windSpeed: number;
  visibility: number;
  humidity: number;
  trailCondition: 'excellent' | 'good' | 'moderate' | 'poor';
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    location: 'Eagle Peak Trail',
    temperature: 72,
    condition: 'sunny',
    windSpeed: 8,
    visibility: 10,
    humidity: 45,
    trailCondition: 'excellent'
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live weather updates
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3),
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 10))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-slate-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConditionColor = () => {
    switch (weather.trailCondition) {
      case 'excellent': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'good': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'poor': return 'bg-red-500/10 text-red-700 border-red-200';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-sky-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Live Trail Conditions
          </CardTitle>
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">LIVE</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon()}
            <div>
              <h3 className="font-semibold text-foreground">{weather.location}</h3>
              <p className="text-sm text-muted-foreground capitalize">{weather.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{Math.round(weather.temperature)}°F</div>
            <Badge className={getConditionColor()}>
              {weather.trailCondition} conditions
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-muted/30">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-medium">{Math.round(weather.windSpeed)} mph</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium">{weather.visibility} mi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium">{Math.round(weather.humidity)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;