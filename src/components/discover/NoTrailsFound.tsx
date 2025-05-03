
import React from 'react';
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

interface NoTrailsFoundProps {
  onResetFilters: () => void;
}

const NoTrailsFound: React.FC<NoTrailsFoundProps> = ({ onResetFilters }) => {
  return (
    <div className="col-span-full py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
        <Compass size={32} />
      </div>
      <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">No trails found</h3>
      <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-4">
        Try adjusting your search criteria or filters to find trails that match your preferences.
      </p>
      <Button onClick={onResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default NoTrailsFound;
