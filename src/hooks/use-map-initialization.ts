
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
  const [error, setError] = useState<string | null>(null);
  const { map, setMap } = useMap();

  useEffect(() => {
    if (!mapContainer.current) {
      console.log('🗺️ Map container not ready yet');
      return;
    }

    if (map) {
      console.log('🗺️ Map already initialized');
      setIsLoading(false);
      return;
    }

    const initializeMap = async () => {
      try {
        console.log('🗺️ Starting map initialization...');
        setIsLoading(true);
        setError(null);
        
        // Get Mapbox token using the utility function
        const token = await getMapboxToken();
        
        if (!token) {
          throw new Error('Failed to retrieve Mapbox token');
        }
        
        console.log('🗺️ Setting Mapbox access token');
        mapboxgl.accessToken = token;

        console.log('🗺️ Creating new map instance with:', { center, zoom, style });
        
        // Create a new map instance
        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: style,
          center: center,
          zoom: zoom,
          pitch: 30,
          attributionControl: true,
          preserveDrawingBuffer: true // Helps with rendering issues
        });

        // Add navigation controls
        newMap.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true
          }),
          'bottom-right'
        );

        // Handle map load event
        newMap.on('load', () => {
          console.log('🗺️ Map loaded successfully');
          setIsLoading(false);
          
          // Add terrain and atmosphere layers with error handling
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
            
            console.log('🗺️ Added terrain and sky layers');
          } catch (terrainError) {
            console.warn('🗺️ Could not add terrain or sky (this is optional):', terrainError);
            // Continue without terrain if it fails
          }
        });

        // Handle map errors
        newMap.on('error', (e) => {
          console.error('🗺️ Map error:', e);
          setError('Map failed to load properly');
        });

        // Handle style load errors
        newMap.on('style.load', () => {
          console.log('🗺️ Map style loaded');
        });

        newMap.on('styledata', () => {
          console.log('🗺️ Map style data loaded');
        });

        console.log('🗺️ Map instance created, setting in context');
        setMap(newMap);

      } catch (error) {
        console.error('🗺️ Error initializing map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown map initialization error';
        setError(errorMessage);
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
        console.log('🗺️ Cleaning up map instance');
        map.remove();
        setMap(null);
      }
    };
  }, [style, mapContainer, center, zoom, setMap, map]);

  return { isLoading, error };
};
