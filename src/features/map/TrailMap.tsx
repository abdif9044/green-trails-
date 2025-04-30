
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import { Trail } from '@/types/trails';
import { MapProvider, useMap } from './context/MapContext';
import { mapStyles } from './utils/mapStyles';
import { getMapboxToken } from './utils/mapUtils';
import MapControls from './components/MapControls';
import MapMarker from './components/MapMarker';
import MapWeatherLayer from './components/MapWeatherLayer';
import ParkingMarker from './components/ParkingMarker';
import TrailPathLayer from './components/TrailPathLayer';
import { useParkingSpots } from '@/hooks/use-parking-spots';

interface TrailMapProps {
  trails?: Trail[];
  onTrailSelect?: (trailId: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showParking?: boolean;
  showTrailPaths?: boolean;
  country?: string;
  stateProvince?: string;
  difficulty?: string;
}

const MapContent: React.FC<TrailMapProps> = ({
  trails = [],
  onTrailSelect,
  center = [-92.4631, 44.0553],
  zoom = 10,
  className = 'h-[500px] w-full',
  showParking = true,
  showTrailPaths = false,
  country,
  stateProvince,
  difficulty
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherLayer, setWeatherLayer] = useState(false);
  const [parkingLayer, setParkingLayer] = useState(showParking);
  const [trailPathsLayer, setTrailPathsLayer] = useState(showTrailPaths);
  const [currentStyle, setCurrentStyle] = useState<keyof typeof mapStyles>('outdoors');
  const { map, setMap } = useMap();
  
  // Get all trail IDs to fetch parking spots
  const trailIds = trails.map(trail => trail.id);
  const { data: parkingSpots = [] } = useParkingSpots();
  
  // Filter parking spots to only show ones for the visible trails
  const relevantParkingSpots = parkingSpots.filter(
    spot => trailIds.includes(spot.trail_id)
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        const token = await getMapboxToken();
        mapboxgl.accessToken = token;

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
  }, [currentStyle, setMap]);

  // Handle filter changes by updating the map
  useEffect(() => {
    if (!map) return;
    
    // You could implement filtering logic here
    // For now, we're just using the filtered trails passed as props
    
  }, [map, country, stateProvince, difficulty]);

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
          onParkingToggle={() => setParkingLayer(!parkingLayer)}
          onTrailPathsToggle={() => setTrailPathsLayer(!trailPathsLayer)}
          weatherEnabled={weatherLayer}
          parkingEnabled={parkingLayer}
          trailPathsEnabled={trailPathsLayer}
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
      
      {map && parkingLayer && relevantParkingSpots.map(parkingSpot => (
        <ParkingMarker
          key={parkingSpot.id}
          parkingSpot={parkingSpot}
          map={map}
        />
      ))}
      
      {map && trailPathsLayer && trails.filter(trail => trail.geojson).map(trail => (
        <TrailPathLayer
          key={trail.id}
          trail={trail}
          map={map}
          onClick={() => onTrailSelect?.(trail.id)}
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
export * from './context/MapContext';
