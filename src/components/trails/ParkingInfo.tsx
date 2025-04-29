
import React from 'react';
import { ParkingMeter } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useParkingSpots } from '@/hooks/use-parking-spots';
import { Badge } from '@/components/ui/badge';

interface ParkingInfoProps {
  trailId: string;
}

const ParkingInfo: React.FC<ParkingInfoProps> = ({ trailId }) => {
  const { data: parkingSpots = [], isLoading } = useParkingSpots(trailId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (parkingSpots.length === 0) {
    return (
      <div className="text-sm text-greentrail-600 dark:text-greentrail-400 italic">
        No parking information available for this trail.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {parkingSpots.map((spot) => (
        <div key={spot.id} className="bg-greentrail-50 dark:bg-greentrail-900/50 p-3 rounded-lg">
          <h4 className="font-medium text-greentrail-800 dark:text-greentrail-200 mb-1">
            {spot.name}
          </h4>
          {spot.description && (
            <p className="text-sm text-greentrail-600 dark:text-greentrail-400 mb-2">
              {spot.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={spot.is_free ? "default" : "outline"} className="bg-greentrail-100 text-greentrail-800 dark:bg-greentrail-800 dark:text-greentrail-100 border-none">
              {spot.is_free ? 'Free parking' : 'Paid parking'}
            </Badge>
            
            {spot.capacity && (
              <Badge variant="outline" className="bg-greentrail-50 text-greentrail-700 dark:bg-greentrail-900 dark:text-greentrail-300">
                {spot.capacity} spots
              </Badge>
            )}
          </div>
          
          {spot.notes && (
            <p className="text-xs italic text-greentrail-500 dark:text-greentrail-400">
              Note: {spot.notes}
            </p>
          )}
          
          <div className="mt-2 text-xs text-greentrail-600 dark:text-greentrail-400">
            <button 
              onClick={() => {
                // Open in Google Maps
                const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
                window.open(url, '_blank');
              }}
              className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200 underline"
            >
              Get directions
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParkingInfo;
