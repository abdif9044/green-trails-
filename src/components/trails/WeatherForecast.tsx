
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HourlyForecast, DailyForecast } from "@/features/weather/types/weather-types";
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Sun, SunDim } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherInfo from "./WeatherInfo";

interface WeatherForecastProps {
  temperature?: number;
  condition?: string;
  high?: number;
  low?: number;
  precipitation?: string;
  sunrise?: string;
  sunset?: string;
  windSpeed?: string;
  windDirection?: string;
  hourlyForecast?: HourlyForecast[];
  dailyForecast?: DailyForecast[];
  isLoading: boolean;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  temperature,
  condition,
  high,
  low,
  precipitation,
  sunrise,
  sunset,
  windSpeed,
  windDirection,
  hourlyForecast = [],
  dailyForecast = [],
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState("current");

  // Helper to determine weather icon based on condition string
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition?.toLowerCase() || "";
    
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    } else if (lowerCondition.includes("snow")) {
      return <CloudSnow className="h-5 w-5 text-blue-300" />;
    } else if (lowerCondition.includes("thunder") || lowerCondition.includes("lightning")) {
      return <CloudLightning className="h-5 w-5 text-yellow-500" />;
    } else if (lowerCondition.includes("cloud")) {
      return <Cloud className="h-5 w-5 text-gray-400" />;
    } else if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
      return <SunDim className="h-5 w-5 text-gray-400" />;
    } else {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="hourly" disabled={hourlyForecast.length === 0}>Hourly</TabsTrigger>
          <TabsTrigger value="daily" disabled={dailyForecast.length === 0}>7-Day</TabsTrigger>
        </TabsList>
        
        <CardContent className="p-4">
          <TabsContent value="current" className="mt-0">
            <WeatherInfo
              temperature={temperature}
              condition={condition}
              high={high}
              low={low}
              precipitation={precipitation}
              sunrise={sunrise}
              sunset={sunset}
              windSpeed={windSpeed}
              windDirection={windDirection}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="hourly" className="mt-0">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-medium">{hour.time}</span>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(hour.condition)}
                      <span className="text-sm">{hour.condition}</span>
                    </div>
                    <span className="font-semibold">{hour.temperature}°</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="daily" className="mt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <span className="text-gray-400">/</span>
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dailyForecast.map((day, index) => (
                  <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0">
                    <p className="font-semibold">{day.date}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.condition)}
                        <span className="text-sm">{day.condition}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{day.high}°</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-500">{day.low}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default WeatherForecast;
