
import React from "react";
import { Cloud, ParkingMeter } from "lucide-react";
import WeatherForecast from "./WeatherForecast";
import SimilarTrails from "./SimilarTrails";
import ParkingInfo from "./ParkingInfo";
import { DetailedWeatherData } from "@/services/weather/weather-service";

interface TrailSidebarProps {
  trailId: string;
  weatherData: DetailedWeatherData | null;
  isWeatherLoading: boolean;
}

const TrailSidebar: React.FC<TrailSidebarProps> = ({ 
  trailId, 
  weatherData, 
  isWeatherLoading 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <Cloud className="h-4 w-4 text-greentrail-600" />
          Weather Forecast
        </h3>
        <WeatherForecast 
          temperature={weatherData?.temperature}
          condition={weatherData?.condition}
          high={weatherData?.high}
          low={weatherData?.low}
          precipitation={weatherData?.precipitation}
          sunrise={weatherData?.sunrise}
          sunset={weatherData?.sunset}
          windSpeed={weatherData?.windSpeed}
          windDirection={weatherData?.windDirection}
          hourlyForecast={weatherData?.hourlyForecast}
          dailyForecast={weatherData?.dailyForecast}
          isLoading={isWeatherLoading}
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <ParkingMeter className="h-4 w-4 text-greentrail-600" />
          Parking Information
        </h3>
        <ParkingInfo trailId={trailId} />
      </div>
      
      <SimilarTrails trailId={trailId} />
    </div>
  );
};

export default TrailSidebar;
