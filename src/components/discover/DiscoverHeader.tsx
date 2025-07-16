
import React from 'react';
import { Mountain } from 'lucide-react';

interface DiscoverHeaderProps {
  trailCount: number;
  totalTrails: number;
}

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({ trailCount, totalTrails }) => {
  return (
    <div className="bg-gradient-to-r from-greentrail-600 to-greentrail-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Discover Trails</h1>
          </div>
          <p className="text-xl text-greentrail-100 mb-2">
            Explore amazing hiking trails from across the country
          </p>
          <p className="text-greentrail-200">
            {totalTrails > 0 ? (
              <>
                Showing {trailCount.toLocaleString()} of {totalTrails.toLocaleString()} trails
              </>
            ) : (
              <>
                {trailCount.toLocaleString()} trails available
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
