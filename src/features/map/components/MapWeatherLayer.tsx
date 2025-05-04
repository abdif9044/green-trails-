
import React from 'react';
import { useWeatherLayer } from '../hooks/use-weather-layer';
import WeatherTypeControls from './WeatherTypeControls';

interface MapWeatherLayerProps {
  enabled: boolean;
  type?: 'temperature' | 'precipitation' | 'clouds' | 'wind';
}

const MapWeatherLayer: React.FC<MapWeatherLayerProps> = ({ 
  enabled, 
  type = 'temperature' 
}) => {
  const { weatherType, setWeatherType } = useWeatherLayer({ 
    enabled, 
    initialType: type 
  });

  // Only render controls if weather layer is enabled
  if (enabled) {
    return (
      <WeatherTypeControls 
        weatherType={weatherType} 
        onTypeChange={setWeatherType} 
      />
    );
  }

  return null;
};

export default MapWeatherLayer;
