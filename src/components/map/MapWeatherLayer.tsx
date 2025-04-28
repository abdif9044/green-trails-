
import React, { useEffect } from 'react';
import { useMap } from './MapContext';
import { supabase } from '@/integrations/supabase/client';

interface MapWeatherLayerProps {
  enabled: boolean;
}

const MapWeatherLayer: React.FC<MapWeatherLayerProps> = ({ enabled }) => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const setupWeatherLayer = async () => {
      if (enabled) {
        try {
          const { data: { apiKey }, error } = await supabase.functions.invoke('get-weather-key');
          if (error) throw error;

          if (!map.getSource('weather-layer')) {
            map.addSource('weather-layer', {
              type: 'raster',
              tiles: [
                `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`
              ],
              tileSize: 256,
              attribution: '© OpenWeather'
            });

            map.addLayer({
              id: 'weather-layer',
              type: 'raster',
              source: 'weather-layer',
              paint: {
                'raster-opacity': 0.6
              }
            });
          }
        } catch (error) {
          console.error('Error setting up weather layer:', error);
        }
      } else {
        if (map.getLayer('weather-layer')) {
          map.removeLayer('weather-layer');
        }
        if (map.getSource('weather-layer')) {
          map.removeSource('weather-layer');
        }
      }
    };

    setupWeatherLayer();
  }, [enabled, map]);

  return null;
};

export default MapWeatherLayer;
