
import React from 'react';
import {
  Compass,
  Cloud,
  MapIcon,
  RefreshCw,
  ParkingMeter,
  Map as MapPin,
  MapPinned
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface MapControlsProps {
  onResetView: () => void;
  onStyleChange: (style: string) => void;
  onWeatherToggle: () => void;
  onParkingToggle: () => void;
  onTrailPathsToggle?: () => void;
  weatherEnabled: boolean;
  parkingEnabled: boolean;
  trailPathsEnabled?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  onResetView,
  onStyleChange,
  onWeatherToggle,
  onParkingToggle,
  onTrailPathsToggle,
  weatherEnabled,
  parkingEnabled,
  trailPathsEnabled
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="secondary" 
        size="icon" 
        onClick={onResetView}
        className="bg-white dark:bg-greentrail-800 shadow-md hover:bg-slate-100 dark:hover:bg-greentrail-700"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white dark:bg-greentrail-800 shadow-md hover:bg-slate-100 dark:hover:bg-greentrail-700"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-48 p-2">
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => onStyleChange('outdoors')}
            >
              <Compass className="mr-2 h-4 w-4" />
              Outdoors
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => onStyleChange('satellite')}
            >
              <MapIcon className="mr-2 h-4 w-4" />
              Satellite
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => onStyleChange('light')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => onStyleChange('dark')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Dark
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <Toggle 
        pressed={weatherEnabled} 
        onPressedChange={onWeatherToggle}
        className="bg-white dark:bg-greentrail-800 shadow-md hover:bg-slate-100 dark:hover:bg-greentrail-700 data-[state=on]:bg-greentrail-100 dark:data-[state=on]:bg-greentrail-600"
      >
        <Cloud className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        pressed={parkingEnabled} 
        onPressedChange={onParkingToggle}
        className="bg-white dark:bg-greentrail-800 shadow-md hover:bg-slate-100 dark:hover:bg-greentrail-700 data-[state=on]:bg-greentrail-100 dark:data-[state=on]:bg-greentrail-600"
      >
        <ParkingMeter className="h-4 w-4" />
      </Toggle>
      
      {onTrailPathsToggle && (
        <Toggle 
          pressed={trailPathsEnabled} 
          onPressedChange={onTrailPathsToggle}
          className="bg-white dark:bg-greentrail-800 shadow-md hover:bg-slate-100 dark:hover:bg-greentrail-700 data-[state=on]:bg-greentrail-100 dark:data-[state=on]:bg-greentrail-600"
        >
          <MapPinned className="h-4 w-4" />
        </Toggle>
      )}
    </div>
  );
};

export default MapControls;
