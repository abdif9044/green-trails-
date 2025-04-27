import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import MapControls from './MapControls';
import { Trail } from '@/types/trails';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3JlZW50cmFpbHMtdGVzdCIsImEiOiJjbDBjZXlmYWMwMDQxM2RydDJ1bm1zYmVqIn0.OnS8ThN47ArmXCkV2NBa9A';

const mapStyles = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11'
};

interface TrailMapProps {
  trails?: Trail[];
  onTrailSelect?: (trailId: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const TrailMap: React.FC<TrailMapProps> = ({
  trails = [],
  onTrailSelect,
  center = [-105.2705, 40.0150],
  zoom = 10,
  className = 'h-[500px] w-full'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLayer, setWeatherLayer] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [currentStyle, setCurrentStyle] = useState<keyof typeof mapStyles>('outdoors');

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[currentStyle],
      center: center,
      zoom: zoom,
      pitch: 30,
      attributionControl: true
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true
      }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setIsLoading(false);
      
      if (map.current) {
        map.current.addSource('terrain', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512
        });
        
        map.current.setTerrain({
          source: 'terrain',
          exaggeration: 1.5
        });

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
  }, [currentStyle]);

  useEffect(() => {
    if (!map.current || isLoading) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    trails.forEach(trail => {
      if (!trail.coordinates) return;

      const element = document.createElement('div');
      element.className = `trail-marker trail-marker-${trail.difficulty.toLowerCase()}`;
      
      const markerStyle = {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        backgroundColor: 
          trail.difficulty === 'easy' ? '#4ade80' :
          trail.difficulty === 'moderate' ? '#fbbf24' :
          trail.difficulty === 'hard' ? '#f87171' :
          '#000000'
      };
      
      Object.assign(element.style, markerStyle);
      
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'bg-white dark:bg-greentrail-800 shadow-lg rounded-lg'
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-greentrail-800 dark:text-greentrail-200">${trail.name}</h3>
          <p class="text-sm text-greentrail-600 dark:text-greentrail-400">${trail.location}</p>
          ${trail.length ? `<p class="text-sm text-greentrail-600 dark:text-greentrail-400 mt-1">${trail.length} miles</p>` : ''}
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

  const handleStyleChange = (style: string) => {
    setCurrentStyle(style as keyof typeof mapStyles);
  };

  const handleResetView = () => {
    map.current?.flyTo({
      center: center,
      zoom: zoom,
      pitch: 30,
      bearing: 0,
      duration: 1500
    });
  };

  const toggleWeatherLayer = () => {
    setWeatherLayer(prev => {
      const newState = !prev;
      
      if (!map.current) return prev;
      
      if (newState) {
        map.current.addLayer({
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
        if (map.current.getLayer('weather-layer')) {
          map.current.removeLayer('weather-layer');
        }
        if (map.current.getSource('weather-layer')) {
          map.current.removeSource('weather-layer');
        }
      }
      
      return newState;
    });
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute top-2 left-2 z-10">
        <MapControls
          onResetView={handleResetView}
          onStyleChange={handleStyleChange}
          onWeatherToggle={toggleWeatherLayer}
          weatherEnabled={weatherLayer}
        />
      </div>
      
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
