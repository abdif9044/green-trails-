
import React, { useEffect } from 'react';
import { useMap } from './MapContext';

interface MapWeatherLayerProps {
  enabled: boolean;
}

const MapWeatherLayer: React.FC<MapWeatherLayerProps> = ({ enabled }) => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    if (enabled) {
      if (!map.getLayer('weather-layer')) {
        map.addLayer({
          id: 'weather-layer',
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [
              'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenWeather'
          },
          paint: {
            'raster-opacity': 0.6
          }
        });
      }
    } else {
      if (map.getLayer('weather-layer')) {
        map.removeLayer('weather-layer');
      }
      if (map.getSource('weather-layer')) {
        map.removeSource('weather-layer');
      }
    }
  }, [enabled, map]);

  return null;
};

export default MapWeatherLayer;
