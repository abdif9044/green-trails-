
import { useState, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { toast } from '@/hooks/use-toast';
import { 
  getOwmLayerType,
  addWeatherLegend
} from '../utils/weather-utils';
import { fetchWeatherApiKey, buildWeatherTileUrl } from '@/services/weather-layer-service';

export type WeatherLayerType = 'temperature' | 'precipitation' | 'clouds' | 'wind';

interface UseWeatherLayerProps {
  enabled: boolean;
  initialType?: WeatherLayerType;
}

/**
 * Hook for managing weather layer on the map
 * @param options - Configuration options for the weather layer
 * @returns State and handlers for the weather layer
 */
export const useWeatherLayer = ({ enabled, initialType = 'temperature' }: UseWeatherLayerProps) => {
  const { map } = useMap();
  const [weatherType, setWeatherType] = useState<WeatherLayerType>(initialType);
  const [loading, setLoading] = useState(false);

  // When weather type changes, update the layer
  useEffect(() => {
    if (enabled && map) {
      updateWeatherLayer(weatherType);
    }
  }, [weatherType, map, enabled]);

  // When enabled prop changes, add or remove the layer
  useEffect(() => {
    if (!map) return;

    if (enabled) {
      setLoading(true);
      updateWeatherLayer(weatherType);
    } else {
      removeWeatherLayer();
    }

    return () => {
      removeWeatherLayer();
    };
  }, [enabled, map]);

  /**
   * Function to add or update weather layer on the map
   * @param layerType - Type of weather layer to display
   */
  const updateWeatherLayer = async (layerType: WeatherLayerType) => {
    if (!map) return;
    
    try {
      // Remove any existing weather layer first
      removeWeatherLayer();
      
      const apiKey = await fetchWeatherApiKey();
      const owmLayer = getOwmLayerType(layerType);
      const tileUrl = buildWeatherTileUrl(owmLayer, apiKey);

      if (!map.getSource('weather-layer')) {
        map.addSource('weather-layer', {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© OpenWeather'
        });

        map.addLayer({
          id: 'weather-layer',
          type: 'raster',
          source: 'weather-layer',
          paint: {
            'raster-opacity': 0.7,
            'raster-fade-duration': 300
          }
        });
        
        // Add legend
        addWeatherLegend(map, layerType);
      }
    } catch (error) {
      console.error('Error setting up weather layer:', error);
      toast({
        title: "Weather layer error",
        description: "Failed to load weather data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove weather layer and legend from map
   */
  const removeWeatherLayer = () => {
    if (!map) return;
    
    try {
      if (map.getLayer('weather-layer')) {
        map.removeLayer('weather-layer');
      }
      if (map.getSource('weather-layer')) {
        map.removeSource('weather-layer');
      }
      
      // Remove legend
      const legend = document.getElementById('weather-legend');
      if (legend) {
        legend.remove();
      }
    } catch (error) {
      console.error('Error removing weather layer:', error);
    }
  };

  return {
    weatherType,
    setWeatherType,
    loading
  };
};
