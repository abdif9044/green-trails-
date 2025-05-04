
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapLayers = (initialShowParking = true, initialShowTrailPaths = false) => {
  const [weatherLayer, setWeatherLayer] = useState(false);
  const [parkingLayer, setParkingLayer] = useState(initialShowParking);
  const [trailPathsLayer, setTrailPathsLayer] = useState(initialShowTrailPaths);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>('outdoors');

  const handleStyleChange = (style: string) => {
    setCurrentMapStyle(style);
  };

  const handleResetView = (map: mapboxgl.Map | null, center: [number, number], zoom: number) => {
    if (!map) return;
    
    map.flyTo({
      center: center,
      zoom: zoom,
      pitch: 30,
      bearing: 0,
      duration: 1500
    });
  };

  return {
    weatherLayer,
    setWeatherLayer,
    parkingLayer,
    setParkingLayer,
    trailPathsLayer,
    setTrailPathsLayer,
    currentMapStyle,
    handleStyleChange,
    handleResetView
  };
};
