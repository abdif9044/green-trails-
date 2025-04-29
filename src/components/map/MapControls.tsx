
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass, Layers, MapIcon, Cloud, CloudRain, CloudSun, ParkingMeter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MapControlsProps {
  onResetView: () => void;
  onStyleChange: (style: string) => void;
  onWeatherToggle: () => void;
  onParkingToggle?: () => void;
  weatherEnabled: boolean;
  parkingEnabled?: boolean;
  className?: string;
}

const MapControls: React.FC<MapControlsProps> = ({
  onResetView,
  onStyleChange,
  onWeatherToggle,
  onParkingToggle,
  weatherEnabled,
  parkingEnabled = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button 
        variant="secondary" 
        size="sm" 
        className="bg-white/90 hover:bg-white shadow-md text-black"
        onClick={onResetView}
      >
        <Compass className="h-4 w-4 mr-1" />
        <span className="text-xs">Reset View</span>
      </Button>
      
      <Select onValueChange={onStyleChange} defaultValue="outdoors">
        <SelectTrigger className="bg-white/90 hover:bg-white shadow-md h-9 text-black">
          <MapIcon className="h-4 w-4 mr-1" />
          <SelectValue placeholder="Map Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="outdoors">Outdoors</SelectItem>
          <SelectItem value="satellite">Satellite</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="bg-white/90 hover:bg-white shadow-md p-2 rounded flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CloudSun className="h-4 w-4 mr-1.5 text-greentrail-600" />
            <Label htmlFor="weather-toggle" className="text-xs cursor-pointer text-black">Weather</Label>
          </div>
          <Switch 
            id="weather-toggle"
            checked={weatherEnabled}
            onCheckedChange={onWeatherToggle}
            className="data-[state=checked]:bg-greentrail-600"
          />
        </div>
        {weatherEnabled && (
          <div className="text-xs text-gray-500">
            Choose layer types in the top-right
          </div>
        )}
      </div>
      
      {onParkingToggle && (
        <div className="bg-white/90 hover:bg-white shadow-md p-2 rounded flex items-center justify-between">
          <div className="flex items-center">
            <ParkingMeter className="h-4 w-4 mr-1.5 text-greentrail-600" />
            <Label htmlFor="parking-toggle" className="text-xs cursor-pointer text-black">Parking</Label>
          </div>
          <Switch 
            id="parking-toggle"
            checked={parkingEnabled}
            onCheckedChange={onParkingToggle}
            className="data-[state=checked]:bg-greentrail-600"
          />
        </div>
      )}
    </div>
  );
};

export default MapControls;
