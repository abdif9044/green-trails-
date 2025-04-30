
import React, { useEffect, useState } from 'react';
import { useMap } from '../context/MapContext';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, CloudSun, CloudRain } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapWeatherLayerProps {
  enabled: boolean;
  type?: 'temperature' | 'precipitation' | 'clouds' | 'wind';
}

const MapWeatherLayer: React.FC<MapWeatherLayerProps> = ({ 
  enabled, 
  type = 'temperature' 
}) => {
  const { map } = useMap();
  const [weatherType, setWeatherType] = useState(type);
  const [loading, setLoading] = useState(false);

  // When weather type changes, update the layer
  useEffect(() => {
    if (enabled && map) {
      updateWeatherLayer(weatherType);
    }
  }, [weatherType, map]);

  // When enabled prop changes, add or remove the layer
  useEffect(() => {
    if (!map) return;

    if (enabled) {
      setLoading(true);
      updateWeatherLayer(weatherType);
    } else {
      removeWeatherLayer();
    }
  }, [enabled, map]);

  const updateWeatherLayer = async (layerType: string) => {
    if (!map) return;
    
    try {
      // Remove any existing weather layer first
      removeWeatherLayer();
      
      const { data: { apiKey }, error } = await supabase.functions.invoke('get-weather-key');
      if (error) throw error;

      // Map layer types to OpenWeatherMap layer types
      const layerMapping = {
        'temperature': 'temp_new',
        'precipitation': 'precipitation_new',
        'clouds': 'clouds_new',
        'wind': 'wind_new'
      };
      
      const owmLayer = layerMapping[layerType as keyof typeof layerMapping] || 'temp_new';

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
        addWeatherLegend(layerType);
      }
    } catch (error) {
      console.error('Error setting up weather layer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addWeatherLegend = (layerType: string) => {
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
    
    // Add legend title and content based on layer type
    let legendContent = '';
    switch(layerType) {
      case 'temperature':
        legendContent = '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Temperature</span></div>' +
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
        break;
      case 'precipitation':
        legendContent = '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Precipitation</span></div>' +
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
        break;
      case 'clouds':
        legendContent = '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Cloud Coverage</span></div>' +
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
        break;
      case 'wind':
        legendContent = '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Wind Speed</span></div>' +
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
        break;
      default:
        legendContent = 'Weather Data';
    }
    
    legend.innerHTML = legendContent;
    map.getContainer().appendChild(legend);
  };

  const removeWeatherLayer = () => {
    if (!map) return;
    
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
  };

  // Render weather type options if enabled
  if (enabled && map) {
    return (
      <div className="absolute top-14 right-2 z-10">
        <TooltipProvider>
          <div className="flex flex-col gap-1 bg-white/80 dark:bg-gray-800/80 p-1 rounded-md shadow-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`p-1.5 rounded-sm ${weatherType === 'temperature' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                  onClick={() => setWeatherType('temperature')}
                >
                  <CloudSun className="h-4 w-4 text-greentrail-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Temperature</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`p-1.5 rounded-sm ${weatherType === 'precipitation' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                  onClick={() => setWeatherType('precipitation')}
                >
                  <CloudRain className="h-4 w-4 text-greentrail-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Precipitation</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`p-1.5 rounded-sm ${weatherType === 'clouds' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                  onClick={() => setWeatherType('clouds')}
                >
                  <Cloud className="h-4 w-4 text-greentrail-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">Cloud coverage</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    );
  }

  return null;
};

export default MapWeatherLayer;
