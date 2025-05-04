
import React, { useRef } from 'react';
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
import { mapStyles } from './mapStyles';

interface MapContentProps {
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

const MapContent: React.FC<MapContentProps> = ({
  trails = [],
  onTrailSelect,
  center = [-92.4631, 44.0553],
  zoom = 10,
  className = 'h-[500px] w-full',
  showParking = true,
  showTrailPaths = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map } = useMap();
  
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
  } = useMapLayers(showParking, showTrailPaths);

  const { isLoading } = useMapInitialization({
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
      
      {map && (
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

      <MapWeatherLayer enabled={weatherLayer} />
      
      {isLoading && <MapLoadingState />}
    </div>
  );
};

export default MapContent;
