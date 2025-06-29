
// Export types
export type { WeatherData, DetailedWeatherData, WeatherForecast } from './services/weather-service';

// Export hooks
export * from './hooks/use-detailed-weather';
export * from './hooks/use-trail-weather';

// Export services
export { weatherService, getTrailWeather, getDetailedTrailWeather } from './services/weather-service';
