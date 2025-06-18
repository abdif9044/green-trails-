
import React, { createContext, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapContextType {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map | null) => void;
  isInitialized: boolean;
  error: string | null;
}

const defaultContextValue: MapContextType = { 
  map: null, 
  setMap: () => {},
  isInitialized: false,
  error: null
};

const MapContext = createContext<MapContextType>(defaultContextValue);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSetMap = (newMap: mapboxgl.Map | null) => {
    setMap(newMap);
    setIsInitialized(!!newMap);
    if (newMap) {
      setError(null);
    }
  };

  const contextValue = {
    map,
    setMap: handleSetMap,
    isInitialized,
    error
  };
  
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
