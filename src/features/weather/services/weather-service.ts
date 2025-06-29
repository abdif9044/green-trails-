
// Weather service for trail conditions and forecasts

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  conditions: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  conditions: string;
  precipitation: number;
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    // For now, we'll use a placeholder API key
    // In production, this should come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo-key';
  }

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        conditions: data.weather[0].main
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return mock data if API fails
      return {
        temperature: 22,
        description: 'Partly cloudy',
        humidity: 65,
        windSpeed: 5.2,
        conditions: 'Clouds'
      };
    }
  }

  async getForecast(lat: number, lng: number): Promise<WeatherForecast[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather forecast API request failed');
      }
      
      const data = await response.json();
      
      // Process the 5-day forecast data
      const forecasts: WeatherForecast[] = [];
      const dailyData = data.list.filter((_: any, index: number) => index % 8 === 0); // Every 24 hours
      
      dailyData.slice(0, 5).forEach((item: any) => {
        forecasts.push({
          date: new Date(item.dt * 1000).toLocaleDateString(),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          conditions: item.weather[0].main,
          precipitation: item.pop * 100 // Probability of precipitation
        });
      });
      
      return forecasts;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      // Return mock forecast data if API fails
      return [
        { date: 'Today', high: 24, low: 18, conditions: 'Sunny', precipitation: 10 },
        { date: 'Tomorrow', high: 26, low: 19, conditions: 'Partly Cloudy', precipitation: 20 },
        { date: 'Day 3', high: 23, low: 17, conditions: 'Cloudy', precipitation: 40 },
        { date: 'Day 4', high: 21, low: 15, conditions: 'Light Rain', precipitation: 80 },
        { date: 'Day 5', high: 25, low: 18, conditions: 'Sunny', precipitation: 15 }
      ];
    }
  }
}

export const weatherService = new WeatherService();
