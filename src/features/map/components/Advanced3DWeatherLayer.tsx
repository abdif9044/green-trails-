
import React, { useEffect, useState } from 'react';
import { use3DWeather } from '../hooks/use-3d-weather';
import WeatherTimelineControl from './WeatherTimelineControl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Eye, 
  EyeOff,
  Settings,
  Layers3
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Advanced3DWeatherLayerProps {
  enabled: boolean;
  coordinates?: [number, number];
}

const Advanced3DWeatherLayer: React.FC<Advanced3DWeatherLayerProps> = ({
  enabled,
  coordinates
}) => {
  const {
    layers,
    currentTime,
    timeRange,
    isAnimating,
    animationSpeed,
    addVolumetricClouds,
    addPrecipitationParticles,
    animateWeatherTime,
    removeWeatherLayer,
    toggleLayerVisibility,
    setAnimationSpeed,
    setTimeRange
  } = use3DWeather();

  const [weatherData, setWeatherData] = useState({
    temperature: 72,
    condition: 'Partly Cloudy',
    precipitation: 20,
    windSpeed: 8
  });

  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (enabled && coordinates) {
      // Initialize with volumetric clouds
      addVolumetricClouds(0.6);
      
      // Add some light precipitation particles
      addPrecipitationParticles('rain', 0.3);
      
      // Set time range for next 48 hours
      const now = Date.now();
      setTimeRange({
        start: now,
        end: now + 48 * 60 * 60 * 1000
      });
    } else {
      // Remove all layers when disabled
      layers.forEach(layer => removeWeatherLayer(layer.id));
    }
  }, [enabled, coordinates]);

  const handleTimeChange = (newTime: number) => {
    animateWeatherTime(newTime, 1000);
    
    // Update weather data based on time (mock data for demo)
    const hour = new Date(newTime).getHours();
    setWeatherData(prev => ({
      ...prev,
      temperature: 65 + Math.sin((hour / 24) * Math.PI * 2) * 15,
      precipitation: Math.max(0, 30 + Math.sin((hour / 12) * Math.PI) * 25)
    }));
  };

  const handleAnimationToggle = () => {
    if (isAnimating) {
      // Stop animation
    } else {
      // Start animation
      const targetTime = currentTime + 6 * 60 * 60 * 1000; // 6 hours ahead
      animateWeatherTime(targetTime, 10000);
    }
  };

  const handleSkipToTime = (direction: 'forward' | 'backward') => {
    const skipAmount = 3 * 60 * 60 * 1000; // 3 hours
    const newTime = direction === 'forward' 
      ? currentTime + skipAmount 
      : currentTime - skipAmount;
    
    const clampedTime = Math.max(
      timeRange.start, 
      Math.min(timeRange.end, newTime)
    );
    
    handleTimeChange(clampedTime);
  };

  const addWeatherLayer = (type: 'clouds' | 'rain' | 'snow') => {
    switch (type) {
      case 'clouds':
        addVolumetricClouds(0.7);
        break;
      case 'rain':
        addPrecipitationParticles('rain', 0.5);
        break;
      case 'snow':
        addPrecipitationParticles('snow', 0.4);
        break;
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Weather Timeline Control */}
      <WeatherTimelineControl
        currentTime={currentTime}
        timeRange={timeRange}
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
        weatherData={weatherData}
        onTimeChange={handleTimeChange}
        onAnimationToggle={handleAnimationToggle}
        onSpeedChange={setAnimationSpeed}
        onSkipToTime={handleSkipToTime}
      />

      {/* Advanced Controls */}
      <div className="absolute top-16 left-4 z-20">
        <Popover open={showControls} onOpenChange={setShowControls}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm shadow-md"
            >
              <Layers3 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                3D Weather Layers
              </h3>

              {/* Quick Add Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Add Layers:</label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addWeatherLayer('clouds')}
                    className="flex items-center gap-1"
                  >
                    <Cloud className="h-3 w-3" />
                    Clouds
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addWeatherLayer('rain')}
                    className="flex items-center gap-1"
                  >
                    <CloudRain className="h-3 w-3" />
                    Rain
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addWeatherLayer('snow')}
                    className="flex items-center gap-1"
                  >
                    <CloudSnow className="h-3 w-3" />
                    Snow
                  </Button>
                </div>
              </div>

              {/* Active Layers */}
              {layers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Active Layers:</label>
                  {layers.map(layer => (
                    <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Toggle
                          pressed={layer.visibility}
                          onPressedChange={() => toggleLayerVisibility(layer.id)}
                          size="sm"
                        >
                          {layer.visibility ? 
                            <Eye className="h-3 w-3" /> : 
                            <EyeOff className="h-3 w-3" />
                          }
                        </Toggle>
                        <span className="text-sm capitalize">{layer.type}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeWeatherLayer(layer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Layer Intensity Controls */}
              {layers.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Layer Intensity:</label>
                  {layers.filter(l => l.visibility).map(layer => (
                    <div key={`${layer.id}-intensity`} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{layer.type}</span>
                        <span>{Math.round(layer.intensity * 100)}%</span>
                      </div>
                      <Slider
                        value={[layer.intensity * 100]}
                        onValueChange={([value]) => {
                          // Update layer intensity
                          console.log(`Update ${layer.id} intensity to ${value}%`);
                        }}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default Advanced3DWeatherLayer;
