
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trail } from '@/types/trails';
import MapContainer from '@/components/map/MapContainer';
import { MapProvider } from './context/MapContext';

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

const TrailMap: React.FC<TrailMapProps> = (props) => {
  return (
    <MapProvider>
      <MapContainer {...props} />
    </MapProvider>
  );
};

export default TrailMap;
export * from './context/MapContext';
export type { TrailMapProps };
