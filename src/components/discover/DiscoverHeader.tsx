
import React from 'react';
import { Badge } from "@/components/ui/badge";

export interface DiscoverHeaderProps {
  trailCount: number;
}

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({ trailCount }) => {
  return (
    <div className="bg-greentrail-800 dark:bg-greentrail-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Trails</h1>
            <p className="text-greentrail-200">Find your next adventure</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge className="bg-greentrail-600 hover:bg-greentrail-700 text-white py-2 px-4 text-lg">
              {trailCount} trails found
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
