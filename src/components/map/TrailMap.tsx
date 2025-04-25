
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Compass, Layers, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Temporary mapbox token for development - should be moved to Supabase secrets in production
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3JlZW50cmFpbHMtdGVzdCIsImEiOiJjbDBjZXlmYWMwMDQxM2RydDJ1bm1zYmVqIn0.OnS8ThN47ArmXCkV2NBa9A';

interface TrailMapProps {
  trails?: Array<{
    id: string;
    name: string;
    location: string;
    coordinates?: [number, number]; // [longitude, latitude]
    difficulty: string;
  }>;
  onTrailSelect?: (trailId: string) => void;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  className?: string;
}

const TrailMap: React.FC<TrailMapProps> = ({
  trails = [],
  onTrailSelect,
  center = [-105.2705, 40.0150], // Default to Boulder, CO
  zoom = 10,
  className = 'h-[500px] w-full'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLayer, setWeatherLayer] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: center,
      zoom: zoom,
      pitch: 30, // Add some 3D perspective
      attributionControl: true
    });

    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true
    });
    map.current.addControl(nav, 'top-right');

    map.current.on('load', () => {
      setIsLoading(false);
      
      if (map.current) {
        // Add 3D terrain
        map.current.addSource('terrain', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512
        });
        
        map.current.setTerrain({
          source: 'terrain',
          exaggeration: 1.5
        });

        // Add sky layer
        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers for each trail
  useEffect(() => {
    if (!map.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    trails.forEach(trail => {
      if (!trail.coordinates) return;

      const element = document.createElement('div');
      element.className = `trail-marker trail-marker-${trail.difficulty.toLowerCase()}`;
      element.style.width = '22px';
      element.style.height = '22px';
      element.style.borderRadius = '50%';
      element.style.cursor = 'pointer';
      
      // Difficulty colors
      const colors: {[key: string]: string} = {
        easy: '#4ade80',
        moderate: '#fbbf24',
        hard: '#f87171',
        expert: '#000000'
      };
      
      element.style.backgroundColor = colors[trail.difficulty.toLowerCase()] || '#4ade80';
      element.style.border = '2px solid white';
      element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-greentrail-800">${trail.name}</h3>
          <p class="text-sm text-greentrail-600">${trail.location}</p>
        </div>
      `);
      
      const marker = new mapboxgl.Marker(element)
        .setLngLat(trail.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
        
      marker.getElement().addEventListener('click', () => {
        if (onTrailSelect) {
          onTrailSelect(trail.id);
        }
      });
      
      markersRef.current.push(marker);
    });
  }, [trails, isLoading, onTrailSelect]);

  // Toggle weather overlay
  const toggleWeatherLayer = () => {
    if (!map.current) return;
    
    setWeatherLayer(prevState => {
      const newState = !prevState;
      
      if (newState) {
        // Add weather layer from a weather API
        map.current!.addLayer({
          id: 'weather-layer',
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [
              `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=1234567890abcdef`
            ],
            tileSize: 256,
            attribution: '© OpenWeather'
          },
          paint: {
            'raster-opacity': 0.6
          }
        });
      } else {
        if (map.current!.getLayer('weather-layer')) {
          map.current!.removeLayer('weather-layer');
        }
        if (map.current!.getSource('weather-layer')) {
          map.current!.removeSource('weather-layer');
        }
      }
      
      return newState;
    });
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Controls */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({
                center: center,
                zoom: zoom,
                pitch: 30,
                bearing: 0,
                duration: 1500
              });
            }
          }}
        >
          <Compass className="h-4 w-4 mr-1" />
          <span className="text-xs">Reset View</span>
        </Button>
        
        <Button 
          variant={weatherLayer ? "default" : "secondary"}
          size="sm" 
          className={weatherLayer ? "shadow-md" : "bg-white/90 hover:bg-white shadow-md"}
          onClick={toggleWeatherLayer}
        >
          <Layers className="h-4 w-4 mr-1" />
          <span className="text-xs">Weather</span>
        </Button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-greentrail-950/80 z-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
            <span className="mt-2 text-greentrail-800 dark:text-greentrail-200">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailMap;
