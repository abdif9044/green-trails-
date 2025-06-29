
import React from 'react';
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import TrailCard from "@/features/trails/components/TrailCard";
import { Trail } from '@/types/trails';
import { Link } from 'react-router-dom';

interface DiscoverTrailsListProps {
  trails: Trail[];
  onResetFilters: () => void;
}

const DiscoverTrailsList: React.FC<DiscoverTrailsListProps> = ({ trails, onResetFilters }) => {
  if (trails.length === 0) {
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
  }

  const handleTrailClick = (trailId: string, trailName: string) => {
    console.log(`DiscoverTrailsList: Navigating to trail ${trailId} (${trailName})`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trails.map((trail) => (
        <div key={trail.id} onClick={() => handleTrailClick(trail.id, trail.name)}>
          <Link to={`/trail/${trail.id}`}>
            <TrailCard 
              id={trail.id}
              name={trail.name}
              location={trail.location}
              imageUrl={trail.imageUrl}
              difficulty={trail.difficulty}
              length={trail.length}
              elevation={trail.elevation_gain}
              tags={trail.tags}
              likes={trail.likes}
              strainTags={trail.strain_tags}
              isAgeRestricted={trail.is_age_restricted}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DiscoverTrailsList;
