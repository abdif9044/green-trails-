
import React, { useRef, useEffect } from 'react';
import { useMapInitialization } from '@/hooks/use-map-initialization';
import { useMapLayers } from '@/hooks/use-map-layers';
import { Trail } from '@/types/trails';
import { useParkingSpots } from '@/hooks/use-parking-spots';
import { useMap } from './MapContext';
import MapControls from './MapControls';
import MapLoadingState from './MapLoadingState';
import MapTrailMarkers from './MapTrailMarkers';
import MapParkingMarkers from './MapParkingMarkers';
import MapTrailPaths from './MapTrailPaths';
import MapWeatherLayer from './MapWeatherLayer';
import { mapStyles } from '@/features/map/utils/mapStyles';

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
  center = [-92.4631, 44.0553], // Default to Minnesota center
  zoom = 10,
  className = 'h-[500px] w-full',
  showParking = true,
  showTrailPaths = false,
  showWeatherLayer = false,
  weatherLayerType = 'temperature'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, isInitialized } = useMap();
  
  const {
    weatherLayer,
    setWeatherLayer,
    parkingLayer,
    setParkingLayer,
    trailPathsLayer,
    setTrailPathsLayer,
    currentMapStyle,
    handleStyleChange,
    handleResetView
  } = useMapLayers(showParking, showTrailPaths, showWeatherLayer);

  // Set initial weather layer state based on prop
  useEffect(() => {
    setWeatherLayer(showWeatherLayer);
  }, [showWeatherLayer, setWeatherLayer]);

  const { isLoading, error } = useMapInitialization({
    mapContainer,
    center,
    zoom,
    style: mapStyles[currentMapStyle as keyof typeof mapStyles]
  });
  
  // Get all trail IDs to fetch parking spots
  const trailIds = trails.map(trail => trail.id);
  const { data: parkingSpots = [] } = useParkingSpots();
  
  // Filter parking spots to only show ones for the visible trails
  const relevantParkingSpots = parkingSpots.filter(
    spot => trailIds.includes(spot.trail_id)
  );

  // Show error state if there's an initialization error
  if (error) {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Map failed to load: {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute top-2 left-2 z-10">
        <MapControls
          onResetView={() => handleResetView(map, center, zoom)}
          onStyleChange={handleStyleChange}
          onWeatherToggle={() => setWeatherLayer(!weatherLayer)}
          onParkingToggle={() => setParkingLayer(!parkingLayer)}
          onTrailPathsToggle={() => setTrailPathsLayer(!trailPathsLayer)}
          weatherEnabled={weatherLayer}
          parkingEnabled={parkingLayer}
          trailPathsEnabled={trailPathsLayer}
        />
      </div>
      
      {map && isInitialized && (
        <>
          <MapTrailMarkers
            trails={trails}
            map={map}
            onTrailSelect={onTrailSelect}
          />
          
          {parkingLayer && (
            <MapParkingMarkers
              parkingSpots={relevantParkingSpots}
              map={map}
            />
          )}
          
          {trailPathsLayer && (
            <MapTrailPaths
              trails={trails.filter(trail => trail.geojson)}
              map={map}
              onTrailSelect={onTrailSelect}
            />
          )}
        </>
      )}

      <MapWeatherLayer 
        enabled={weatherLayer} 
        type={weatherLayerType} 
      />
      
      {isLoading && <MapLoadingState message="Loading map..." />}
    </div>
  );
};

export default MapContent;
