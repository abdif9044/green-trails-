
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trail } from '@/types/trails';
import MapContainer from './MapContainer';
import { MapProvider } from './MapContext';

interface TrailMapProps {
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

const TrailMap: React.FC<TrailMapProps> = (props) => {
  return (
    <MapProvider>
      <MapContainer {...props} />
    </MapProvider>
  );
};

export default TrailMap;
export * from './MapContext';
