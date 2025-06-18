import React, { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import { Trail } from '@/types/trails';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import { validateCoordinates } from '@/features/map/utils/mapUtils';

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
      console.log('🗺️ No center provided, finding suitable center from trails');
      
      // Try to find a trail with valid coordinates
      let foundValidCoords = false;
      for (const trail of trails) {
        const validCoords = validateCoordinates(trail.coordinates);
        if (validCoords) {
          console.log(`🗺️ Using coordinates from trail ${trail.name}: [${validCoords[0]}, ${validCoords[1]}]`);
          setUsableCenter(validCoords);
          foundValidCoords = true;
          break;
        }
      }
      
      if (!foundValidCoords) {
        console.log('🗺️ No valid coordinates found in trails, using default US center');
        setUsableCenter([-98.5795, 39.8283]); // Default to US center
      }
    } else if (center) {
      const validCenter = validateCoordinates(center);
      if (validCenter) {
        setUsableCenter(validCenter);
      } else {
        console.warn('🗺️ Invalid center coordinates provided:', center);
        setUsableCenter([-98.5795, 39.8283]);
      }
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

  // Filter trails to only include those with valid coordinates
  const [visibleTrails, setVisibleTrails] = useState<Trail[]>([]);
  const batchSize = 200;

  useEffect(() => {
    console.log(`🗺️ Processing ${trails.length} trails for map display`);
    
    // Filter trails with valid coordinates
    const validTrails = trails.filter(trail => {
      const isValid = validateCoordinates(trail.coordinates) !== null;
      if (!isValid) {
        console.warn(`🗺️ Skipping trail ${trail.name} - invalid coordinates:`, trail.coordinates);
      }
      return isValid;
    });
    
    console.log(`🗺️ Found ${validTrails.length} trails with valid coordinates`);
    
    // If we have a reasonable number of trails, show them all
    if (validTrails.length <= batchSize) {
      setVisibleTrails(validTrails);
      return;
    }

    // Otherwise, limit to the first batch for initial load
    setVisibleTrails(validTrails.slice(0, batchSize));
    
    // Then load the rest after a delay for better UI responsiveness
    const timer = setTimeout(() => {
      setVisibleTrails(validTrails);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [trails]);

  // Toggle trail paths
  const togglePaths = () => {
    setShowPaths(!showPaths);
  };

  if (!usableCenter) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center p-6">
          <div className="text-gray-400 mb-2">🗺️</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unable to determine map center
          </p>
        </div>
      </div>
    );
  }

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
      
      {visibleTrails.length === 0 && trails.length > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-background/80 px-4 py-2 rounded text-sm text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No trails with valid coordinates found
          </p>
        </div>
      )}
    </div>
  );
};

export default TrailMap;
