
import React from 'react';
import { Compass, Map, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

export interface DiscoverViewControlsProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (value: 'list' | 'map') => void;
  showTrailPaths?: boolean;
  onToggleTrailPaths?: () => void;
}

const DiscoverViewControls: React.FC<DiscoverViewControlsProps> = ({
  viewMode,
  onViewModeChange,
  showTrailPaths,
  onToggleTrailPaths
}) => {
  return (
    <div className="flex items-center gap-3">
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => onViewModeChange(value as 'list' | 'map')}
        className="mr-2"
      >
        <TabsList className="grid grid-cols-2 h-9 w-[160px]">
          <TabsTrigger value="list" className="text-xs">
            <Compass className="h-4 w-4 mr-1" />
            List View
          </TabsTrigger>
          <TabsTrigger value="map" className="text-xs">
            <Map className="h-4 w-4 mr-1" />
            Map View
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {viewMode === 'map' && onToggleTrailPaths && (
        <Toggle 
          pressed={showTrailPaths} 
          onPressedChange={onToggleTrailPaths}
          className="bg-white dark:bg-greentrail-800 border border-input hover:bg-slate-100 dark:hover:bg-greentrail-700 data-[state=on]:bg-greentrail-100 data-[state=on]:text-greentrail-900 dark:data-[state=on]:bg-greentrail-600 dark:data-[state=on]:text-greentrail-100 h-9 px-3"
        >
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-xs">Show Paths</span>
        </Toggle>
      )}
      
      <Select defaultValue="popular">
        <SelectTrigger className="w-[180px] bg-white dark:bg-greentrail-800 border-greentrail-200 dark:border-greentrail-700">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="recent">Recently Added</SelectItem>
          <SelectItem value="length-asc">Length (Shortest)</SelectItem>
          <SelectItem value="length-desc">Length (Longest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DiscoverViewControls;
