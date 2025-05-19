
import React from 'react';
import { MapProvider } from './MapContext';
import MapContent from './MapContent';
import { Trail } from '@/types/trails';

interface MapContainerProps {
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

const MapContainer: React.FC<MapContainerProps> = (props) => {
  return (
    <MapProvider>
      <MapContent {...props} />
    </MapProvider>
  );
};

export default MapContainer;
