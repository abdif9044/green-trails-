
import { useState, useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from '@/components/map/MapContext';
import { getMapboxToken } from '@/features/map/utils/mapUtils';
import { toast } from '@/hooks/use-toast';

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
        // Get Mapbox token using the utility function from mapUtils
        const token = await getMapboxToken();
        
        if (!token) {
          throw new Error('Failed to retrieve Mapbox token');
        }
        
        mapboxgl.accessToken = token;

        // Create a new map instance
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

        // Handle map load event
        newMap.on('load', () => {
          setIsLoading(false);
          
          // Add terrain and atmosphere layers
          try {
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
          } catch (terrainError) {
            console.warn('Could not add terrain or sky:', terrainError);
            // Continue without terrain if it fails
          }
        });

        setMap(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Map Error",
          description: "Could not initialize map. Please try again later.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    // Initialize map
    initializeMap();

    // Cleanup function to remove map when component unmounts
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [style, mapContainer, center, zoom, setMap, map]);

  return { isLoading };
};
