
// Public API for the map feature
export { default as TrailMap } from './components/TrailMap';
export { MapProvider, useMap } from './context/MapContext';

// Types
export type { MapContextType } from './context/MapContext';

// Hooks
export * from './hooks/use-weather-layer';

// Utils
export * from './utils/mapStyles';
export * from './utils/mapUtils';
export * from './utils/weather-utils';
