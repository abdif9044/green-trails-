
import React from 'react';
import { Trail } from '@/types/trails';
import MapContent from './MapContent';

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
  return <MapContent {...props} />;
};

export default MapContainer;
