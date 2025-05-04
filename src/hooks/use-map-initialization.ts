
import { useState, useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/components/map/MapContext';

interface UseMapInitializationProps {
  mapContainer: RefObject<HTMLDivElement>;
  center: [number, number];
  zoom: number;
  style: string;
}

export const useMapInitialization = ({
  mapContainer,
  center,
  zoom,
  style
}: UseMapInitializationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { map, setMap } = useMap();

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Get Mapbox token from Supabase function
        const response = await fetch('/api/get-mapbox-token');
        const { token } = await response.json();
        
        if (!token) {
          throw new Error('Failed to retrieve Mapbox token');
        }
        
        mapboxgl.accessToken = token;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: style,
          center: center,
          zoom: zoom,
          pitch: 30,
          attributionControl: true
        });

        newMap.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true
          }),
          'bottom-right'
        );

        newMap.on('load', () => {
          setIsLoading(false);
          
          newMap.addSource('terrain', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512
          });
          
          newMap.setTerrain({
            source: 'terrain',
            exaggeration: 1.5
          });

          newMap.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 0.0],
              'sky-atmosphere-sun-intensity': 15
            }
          });
        });

        setMap(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      map?.remove();
      setMap(null);
    };
  }, [style, mapContainer, center, zoom, setMap, map]);

  return { isLoading };
};
