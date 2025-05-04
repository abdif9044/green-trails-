
import { WeatherLayerType } from '../hooks/use-weather-layer';

/**
 * Creates HTML content for the temperature legend
 * @returns HTML string for the temperature legend
 */
export const createTemperatureLegend = (): string => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Temperature</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/6 bg-blue-700"></div>' +
    '<div class="h-2 w-1/6 bg-blue-500"></div>' +
    '<div class="h-2 w-1/6 bg-green-500"></div>' +
    '<div class="h-2 w-1/6 bg-yellow-500"></div>' +
    '<div class="h-2 w-1/6 bg-orange-500"></div>' +
    '<div class="h-2 w-1/6 bg-red-600"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Cold</span>' +
    '<span>Hot</span>' +
    '</div>';
};

/**
 * Creates HTML content for the precipitation legend
 * @returns HTML string for the precipitation legend
 */
export const createPrecipitationLegend = (): string => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Precipitation</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/4 bg-blue-200"></div>' +
    '<div class="h-2 w-1/4 bg-blue-400"></div>' +
    '<div class="h-2 w-1/4 bg-blue-600"></div>' +
    '<div class="h-2 w-1/4 bg-blue-800"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Light</span>' +
    '<span>Heavy</span>' +
    '</div>';
};

/**
 * Creates HTML content for the cloud coverage legend
 * @returns HTML string for the cloud coverage legend
 */
export const createCloudCoverageLegend = (): string => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Cloud Coverage</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/4 bg-gray-100"></div>' +
    '<div class="h-2 w-1/4 bg-gray-300"></div>' +
    '<div class="h-2 w-1/4 bg-gray-500"></div>' +
    '<div class="h-2 w-1/4 bg-gray-700"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Clear</span>' +
    '<span>Overcast</span>' +
    '</div>';
};

/**
 * Creates HTML content for the wind speed legend
 * @returns HTML string for the wind speed legend
 */
export const createWindSpeedLegend = (): string => {
  return '<div class="flex items-center mb-1 font-semibold"><span class="text-greentrail-600">Wind Speed</span></div>' +
    '<div class="flex h-2 w-full mb-1">' +
    '<div class="h-2 w-1/5 bg-green-200"></div>' +
    '<div class="h-2 w-1/5 bg-green-400"></div>' +
    '<div class="h-2 w-1/5 bg-yellow-400"></div>' +
    '<div class="h-2 w-1/5 bg-orange-400"></div>' +
    '<div class="h-2 w-1/5 bg-red-500"></div>' +
    '</div>' +
    '<div class="flex justify-between text-xs text-gray-600 dark:text-gray-300">' +
    '<span>Calm</span>' +
    '<span>Strong</span>' +
    '</div>';
};

/**
 * Maps weather types to OpenWeatherMap layer types
 * @param weatherType - Type of weather layer to show
 * @returns OpenWeatherMap layer identifier
 */
export const getOwmLayerType = (weatherType: WeatherLayerType): string => {
  const layerMapping = {
    'temperature': 'temp_new',
    'precipitation': 'precipitation_new',
    'clouds': 'clouds_new',
    'wind': 'wind_new'
  };
  
  return layerMapping[weatherType] || 'temp_new';
};

/**
 * Generates legend HTML based on weather type
 * @param layerType - Type of weather layer
 * @returns HTML string for the legend
 */
export const getLegendForWeatherType = (layerType: WeatherLayerType): string => {
  switch(layerType) {
    case 'temperature':
      return createTemperatureLegend();
    case 'precipitation':
      return createPrecipitationLegend();
    case 'clouds':
      return createCloudCoverageLegend();
    case 'wind':
      return createWindSpeedLegend();
    default:
      return 'Weather Data';
  }
};

/**
 * Adds a legend to the map container for the current weather type
 * @param map - Mapbox map instance 
 * @param layerType - Type of weather layer
 */
export const addWeatherLegend = (map: mapboxgl.Map | null, layerType: WeatherLayerType): void => {
  if (!map || !map.getContainer()) return;
  
  // Remove any existing legends
  const existingLegend = document.getElementById('weather-legend');
  if (existingLegend) {
    existingLegend.remove();
  }
  
  // Create legend container
  const legend = document.createElement('div');
  legend.id = 'weather-legend';
  legend.className = 'absolute bottom-12 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded shadow-md text-xs z-10';
  
  // Add legend content based on layer type
  legend.innerHTML = getLegendForWeatherType(layerType);
  map.getContainer().appendChild(legend);
};
