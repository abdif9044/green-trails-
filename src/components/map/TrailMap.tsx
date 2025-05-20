import React, { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import { Trail } from '@/types/trails';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface TrailMapProps {
  trails: Trail[];
  onTrailSelect?: (trailId: string) => void;
  center?: [number, number];
  zoom?: number;
  showTrailPaths?: boolean;
  showWeatherLayer?: boolean;
  weatherLayerType?: 'temperature' | 'precipitation' | 'clouds' | 'wind';
  country?: string;
  stateProvince?: string;
  difficulty?: string;
}

const TrailMap: React.FC<TrailMapProps> = ({ 
  trails, 
  onTrailSelect,
  center,
  zoom,
  showTrailPaths = false,
  showWeatherLayer = false,
  weatherLayerType = 'temperature',
  country,
  stateProvince,
  difficulty
}) => {
  const [showPaths, setShowPaths] = useState(showTrailPaths);
  const [usableCenter, setUsableCenter] = useState<[number, number] | undefined>(center);
  const [usableZoom, setUsableZoom] = useState<number | undefined>(zoom);

  // Determine the map center based on trails if not provided
  useEffect(() => {
    if (!center && trails.length > 0) {
      // Try to find a trail with coordinates
      const trailWithCoords = trails.find(t => t.coordinates);
      if (trailWithCoords && trailWithCoords.coordinates) {
        setUsableCenter(trailWithCoords.coordinates);
      } else {
        // Default to US center if no coordinates available
        setUsableCenter([-98.5795, 39.8283]);
      }
    } else if (center) {
      setUsableCenter(center);
    }

    // Set zoom level based on filter specificity
    if (!zoom) {
      if (stateProvince) {
        setUsableZoom(7); // State level
      } else if (country) {
        setUsableZoom(4); // Country level
      } else {
        setUsableZoom(3); // World level
      }
    } else {
      setUsableZoom(zoom);
    }
  }, [trails, center, zoom, country, stateProvince]);

  // Split trails into batches for better performance with large datasets
  const [visibleTrails, setVisibleTrails] = useState<Trail[]>([]);
  const batchSize = 200;

  useEffect(() => {
    // If we have a reasonable number of trails, show them all
    if (trails.length <= batchSize) {
      setVisibleTrails(trails);
      return;
    }

    // Otherwise, limit to the first batch for initial load
    setVisibleTrails(trails.slice(0, batchSize));
    
    // Then load the rest after a delay for better UI responsiveness
    const timer = setTimeout(() => {
      setVisibleTrails(trails);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [trails]);

  // Toggle trail paths
  const togglePaths = () => {
    setShowPaths(!showPaths);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        trails={visibleTrails}
        onTrailSelect={onTrailSelect}
        center={usableCenter}
        zoom={usableZoom}
        showTrailPaths={showPaths}
        showWeatherLayer={showWeatherLayer}
        weatherLayerType={weatherLayerType}
        className="h-full w-full rounded-lg shadow-md"
        country={country}
        stateProvince={stateProvince}
        difficulty={difficulty}
      />
      
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          onClick={togglePaths}
          variant={showPaths ? "default" : "outline"}
          size="sm"
          className="shadow-md"
        >
          <Layers className="h-4 w-4 mr-2" />
          {showPaths ? "Hide Paths" : "Show Paths"}
        </Button>
      </div>
      
      {trails.length > batchSize && visibleTrails.length < trails.length && (
        <div className="absolute bottom-4 left-4 z-10 bg-background/80 px-3 py-1 rounded text-sm">
          Loading {trails.length} trails...
        </div>
      )}
    </div>
  );
};

export default TrailMap;
