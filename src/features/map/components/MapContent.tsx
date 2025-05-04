
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '../context/MapContext';
import MapLoadingState from './MapLoadingState';
import MapControls from './MapControls';
import MapParkingMarkers from './MapParkingMarkers';
import MapTrailMarkers from './MapTrailMarkers';
import MapTrailPaths from './MapTrailPaths';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';
import { fetchWeatherApiKey, buildWeatherTileUrl } from '@/services/weather-layer-service';

interface MapContentProps {
  trails?: Trail[];
  onTrailSelect?: (trailId: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showParking?: boolean;
  showTrailPaths?: boolean;
  showWeatherLayer?: boolean;
  weatherLayerType?: 'temperature' | 'precipitation' | 'clouds' | 'wind';
  country?: string;
  stateProvince?: string;
  difficulty?: string;
}

const MapContent: React.FC<MapContentProps> = ({
  trails = [],
  onTrailSelect,
  center = [-100, 40],
  zoom = 3,
  className = "h-96",
  showParking = false,
  showTrailPaths = false,
  showWeatherLayer = false,
  weatherLayerType = 'temperature',
  country,
  stateProvince,
  difficulty,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMap();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const weatherSourceId = 'weather-layer';
  const weatherLayerId = 'weather-layer-tiles';
  
  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;
      if (map) return; // Don't initialize if already exists
      
      try {
        // Get Mapbox token from Supabase Edge Function
        const { data: { mapboxToken }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error || !mapboxToken) {
          throw new Error('Failed to retrieve Mapbox API key');
        }
        
        // Initialize Mapbox
        mapboxgl.accessToken = mapboxToken;
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center,
          zoom,
          pitch: 0,
          attributionControl: true,
        });
        
        newMap.on('load', () => {
          setIsLoaded(true);
          setMap(newMap);
        });
        
        newMap.on('error', (e) => {
          setError(`Map error: ${e.error?.message || 'Unknown error'}`);
        });
        
        // Add controls
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        newMap.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
        newMap.addControl(new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true
        }), 'top-right');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please try again later.');
      }
    };
    
    initializeMap();
    
    // Cleanup
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []);
  
  // Handle weather layer
  useEffect(() => {
    if (!map || !isLoaded || !showWeatherLayer) return;
    
    const addWeatherLayer = async () => {
      try {
        // Remove existing weather layer if it exists
        if (map.getSource(weatherSourceId)) {
          map.removeLayer(weatherLayerId);
          map.removeSource(weatherSourceId);
        }
        
        const weatherApiKey = await fetchWeatherApiKey();
        const tileUrl = buildWeatherTileUrl(weatherLayerType, weatherApiKey);
        
        map.addSource(weatherSourceId, {
          type: 'raster',
          tiles: [tileUrl],
          tileSize: 256,
          attribution: '© OpenWeatherMap'
        });
        
        map.addLayer({
          id: weatherLayerId,
          type: 'raster',
          source: weatherSourceId,
          paint: {
            'raster-opacity': 0.6
          }
        });
      } catch (error) {
        console.error('Error adding weather layer:', error);
      }
    };
    
    if (showWeatherLayer) {
      addWeatherLayer();
    }
    
  }, [map, isLoaded, showWeatherLayer, weatherLayerType]);
  
  // Update map center and zoom when props change
  useEffect(() => {
    if (!map || !isLoaded) return;
    
    map.flyTo({
      center,
      zoom,
      essential: true
    });
  }, [map, isLoaded, center, zoom]);
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {!isLoaded && <MapLoadingState />}
      {error && <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center text-destructive">{error}</div>}
      <div ref={mapContainer} className="w-full h-full" />
      
      {map && isLoaded && (
        <>
          <MapControls />
          
          {showTrailPaths && <MapTrailPaths map={map} trails={trails} />}
          
          <MapTrailMarkers 
            map={map} 
            trails={trails} 
            onTrailSelect={onTrailSelect} 
          />
          
          {showParking && <MapParkingMarkers map={map} trails={trails} />}
        </>
      )}
    </div>
  );
};

export default MapContent;
