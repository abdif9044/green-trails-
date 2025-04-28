
import React from 'react';
import { Compass, Map } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiscoverViewControlsProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (value: 'list' | 'map') => void;
}

const DiscoverViewControls: React.FC<DiscoverViewControlsProps> = ({
  viewMode,
  onViewModeChange
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
