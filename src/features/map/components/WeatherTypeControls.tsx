
import React from 'react';
import { Cloud, CloudSun, CloudRain, Wind } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WeatherLayerType = 'temperature' | 'precipitation' | 'clouds' | 'wind';

interface WeatherTypeControlsProps {
  weatherType: WeatherLayerType;
  onTypeChange: (type: WeatherLayerType) => void;
}

const WeatherTypeControls: React.FC<WeatherTypeControlsProps> = ({ weatherType, onTypeChange }) => {
  return (
    <div className="absolute top-14 right-2 z-10">
      <TooltipProvider>
        <div className="flex flex-col gap-1 bg-white/80 dark:bg-gray-800/80 p-1 rounded-md shadow-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`p-1.5 rounded-sm ${weatherType === 'temperature' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                onClick={() => onTypeChange('temperature')}
              >
                <CloudSun className="h-4 w-4 text-greentrail-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Temperature</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`p-1.5 rounded-sm ${weatherType === 'precipitation' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                onClick={() => onTypeChange('precipitation')}
              >
                <CloudRain className="h-4 w-4 text-greentrail-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Precipitation</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`p-1.5 rounded-sm ${weatherType === 'clouds' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                onClick={() => onTypeChange('clouds')}
              >
                <Cloud className="h-4 w-4 text-greentrail-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Cloud coverage</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`p-1.5 rounded-sm ${weatherType === 'wind' ? 'bg-greentrail-100 dark:bg-greentrail-900' : 'hover:bg-greentrail-50 dark:hover:bg-greentrail-900/50'}`}
                onClick={() => onTypeChange('wind')}
              >
                <Wind className="h-4 w-4 text-greentrail-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Wind</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default WeatherTypeControls;
