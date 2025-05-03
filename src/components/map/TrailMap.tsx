
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trail } from '@/types/trails';
import { MapProvider } from './MapContext';
import MapContent from './MapContent';

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
      <MapContent {...props} />
    </MapProvider>
  );
};

export default TrailMap;
