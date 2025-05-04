
/**
 * Basic weather information
 */
export interface WeatherData {
  temperature: number;
  condition: string;
  high: number;
  low: number;
  precipitation: string;
  sunrise: string;
  sunset: string;
  windSpeed?: string;
  windDirection?: string;
}

/**
 * Hourly weather forecast information
 */
export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  icon: string;
}

/**
 * Daily weather forecast information
 */
export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

/**
 * Detailed weather data including forecasts
 */
export interface DetailedWeatherData extends WeatherData {
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}
