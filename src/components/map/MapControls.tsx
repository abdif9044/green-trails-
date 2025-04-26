
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass, Layers, Map as MapIcon } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapControlsProps {
  onResetView: () => void;
  onStyleChange: (style: string) => void;
  onWeatherToggle: () => void;
  weatherEnabled: boolean;
  className?: string;
}

const MapControls: React.FC<MapControlsProps> = ({
  onResetView,
  onStyleChange,
  onWeatherToggle,
  weatherEnabled,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button 
        variant="secondary" 
        size="sm" 
        className="bg-white/90 hover:bg-white shadow-md"
        onClick={onResetView}
      >
        <Compass className="h-4 w-4 mr-1" />
        <span className="text-xs">Reset View</span>
      </Button>
      
      <Select onValueChange={onStyleChange} defaultValue="outdoors">
        <SelectTrigger className="bg-white/90 hover:bg-white shadow-md h-9">
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
      
      <Button 
        variant={weatherEnabled ? "default" : "secondary"}
        size="sm" 
        className={weatherEnabled ? "shadow-md" : "bg-white/90 hover:bg-white shadow-md"}
        onClick={onWeatherToggle}
      >
        <Layers className="h-4 w-4 mr-1" />
        <span className="text-xs">Weather</span>
      </Button>
    </div>
  );
};

export default MapControls;
