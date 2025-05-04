
import React, { createContext, useContext, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export interface MapContextType {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map | null) => void;
}

const MapContext = createContext<MapContextType>({ map: null, setMap: () => {} });

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
