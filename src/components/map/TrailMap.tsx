
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import MapControls from './MapControls';
import { Trail } from '@/types/trails';
import { MapProvider, useMap } from './MapContext';
import MapMarker from './MapMarker';
import MapWeatherLayer from './MapWeatherLayer';

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

const MapContent: React.FC<TrailMapProps> = ({
  trails = [],
  onTrailSelect,
  center = [-105.2705, 40.0150],
  zoom = 10,
  className = 'h-[500px] w-full'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLayer, setWeatherLayer] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<keyof typeof mapStyles>('outdoors');
  const { map, setMap } = useMap();

  useEffect(() => {
    if (!mapContainer.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[currentStyle],
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

    return () => {
      newMap.remove();
      setMap(null);
    };
  }, [currentStyle, setMap]);

  const handleStyleChange = (style: string) => {
    setCurrentStyle(style as keyof typeof mapStyles);
  };

  const handleResetView = () => {
    map?.flyTo({
      center: center,
      zoom: zoom,
      pitch: 30,
      bearing: 0,
      duration: 1500
    });
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute top-2 left-2 z-10">
        <MapControls
          onResetView={handleResetView}
          onStyleChange={handleStyleChange}
          onWeatherToggle={() => setWeatherLayer(!weatherLayer)}
          weatherEnabled={weatherLayer}
        />
      </div>
      
      {map && trails.map(trail => (
        <MapMarker
          key={trail.id}
          trail={trail}
          map={map}
          onSelect={onTrailSelect}
        />
      ))}

      <MapWeatherLayer enabled={weatherLayer} />
      
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

const TrailMap: React.FC<TrailMapProps> = (props) => {
  return (
    <MapProvider>
      <MapContent {...props} />
    </MapProvider>
  );
};

export default TrailMap;
