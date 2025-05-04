
import { useState, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type WeatherLayerType = 'temperature' | 'precipitation' | 'clouds' | 'wind';

interface UseWeatherLayerProps {
  enabled: boolean;
  initialType?: WeatherLayerType;
}

// Legend content generator functions
const createTemperatureLegend = () => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Temperature</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/6 bg-blue-700"></div>' +
    '<div class="h-2 w-1/6 bg-blue-500"></div>' +
    '<div class="h-2 w-1/6 bg-green-500"></div>' +
    '<div class="h-2 w-1/6 bg-yellow-500"></div>' +
    '<div class="h-2 w-1/6 bg-orange-500"></div>' +
    '<div class="h-2 w-1/6 bg-red-600"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Cold</span>' +
    '<span>Hot</span>' +
    '</div>';
};

const createPrecipitationLegend = () => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Precipitation</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/4 bg-blue-200"></div>' +
    '<div class="h-2 w-1/4 bg-blue-400"></div>' +
    '<div class="h-2 w-1/4 bg-blue-600"></div>' +
    '<div class="h-2 w-1/4 bg-blue-800"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Light</span>' +
    '<span>Heavy</span>' +
    '</div>';
};

const createCloudCoverageLegend = () => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Cloud Coverage</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/4 bg-gray-100"></div>' +
    '<div class="h-2 w-1/4 bg-gray-300"></div>' +
    '<div class="h-2 w-1/4 bg-gray-500"></div>' +
    '<div class="h-2 w-1/4 bg-gray-700"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Clear</span>' +
    '<span>Overcast</span>' +
    '</div>';
};

const createWindSpeedLegend = () => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Wind Speed</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/5 bg-green-200"></div>' +
    '<div class="h-2 w-1/5 bg-green-400"></div>' +
    '<div class="h-2 w-1/5 bg-yellow-400"></div>' +
    '<div class="h-2 w-1/5 bg-orange-400"></div>' +
    '<div class="h-2 w-1/5 bg-red-500"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Calm</span>' +
    '<span>Strong</span>' +
    '</div>';
};

// Maps weather types to OpenWeatherMap layer types
const getOwmLayerType = (weatherType: WeatherLayerType): string => {
  const layerMapping = {
    'temperature': 'temp_new',
    'precipitation': 'precipitation_new',
    'clouds': 'clouds_new',
    'wind': 'wind_new'
  };
  
  return layerMapping[weatherType] || 'temp_new';
};

// Generates legend HTML based on weather type
const getLegendForWeatherType = (layerType: WeatherLayerType): string => {
  switch(layerType) {
    case 'temperature':
      return createTemperatureLegend();
    case 'precipitation':
      return createPrecipitationLegend();
    case 'clouds':
      return createCloudCoverageLegend();
    case 'wind':
      return createWindSpeedLegend();
    default:
      return 'Weather Data';
  }
};

// Fetches the OpenWeather API key from Supabase
const fetchWeatherApiKey = async (): Promise<string> => {
  try {
    const { data: { apiKey }, error } = await supabase.functions.invoke('get-weather-key');
    
    if (error) {
      throw new Error(`Failed to get weather API key: ${error.message}`);
    }
    
    if (!apiKey) {
      throw new Error('Weather API key is not configured');
    }
    
    return apiKey;
  } catch (error) {
    console.error('Error fetching weather API key:', error);
    toast({
      title: "Weather layer error",
      description: "Unable to load weather data layer. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Adds a legend to the map container for the current weather type
const addWeatherLegend = (map: mapboxgl.Map | null, layerType: WeatherLayerType): void => {
  if (!map || !map.getContainer()) return;
  
  // Remove any existing legends
  const existingLegend = document.getElementById('weather-legend');
  if (existingLegend) {
    existingLegend.remove();
  }
  
  // Create legend container
  const legend = document.createElement('div');
  legend.id = 'weather-legend';
  legend.className = 'absolute bottom-12 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded shadow-md text-xs z-10';
  
  // Add legend content based on layer type
  legend.innerHTML = getLegendForWeatherType(layerType);
  map.getContainer().appendChild(legend);
};

// Main hook function
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

  // Function to add or update weather layer on the map
  const updateWeatherLayer = async (layerType: WeatherLayerType) => {
    if (!map) return;
    
    try {
      // Remove any existing weather layer first
      removeWeatherLayer();
      
      const apiKey = await fetchWeatherApiKey();
      const owmLayer = getOwmLayerType(layerType);

      if (!map.getSource('weather-layer')) {
        map.addSource('weather-layer', {
          type: 'raster',
          tiles: [
            `https://tile.openweathermap.org/map/${owmLayer}/{z}/{x}/{y}.png?appid=${apiKey}`
          ],
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

  // Remove weather layer and legend from map
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
