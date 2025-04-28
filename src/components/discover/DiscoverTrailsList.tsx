
import React from 'react';
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import TrailCard from "@/components/TrailCard";
import { Trail } from '@/types/trails';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface DiscoverTrailsListProps {
  trails: Trail[];
  onResetFilters: () => void;
}

const DiscoverTrailsList: React.FC<DiscoverTrailsListProps> = ({ trails, onResetFilters }) => {
  // Helper function to get trail image URL
  const getTrailImageUrl = (trail: Trail) => {
    if (trail.imageUrl && trail.imageUrl.startsWith('http')) {
      return trail.imageUrl;
    }
    
    // If we have an image path in storage, construct the URL
    if (trail.imageUrl) {
      return supabase.storage.from('trail_images').getPublicUrl(trail.imageUrl).data.publicUrl;
    }
    
    // Fallback image
    return 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop';
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trails.map((trail) => (
        <Link to={`/trail/${trail.id}`} key={trail.id}>
          <TrailCard 
            id={trail.id}
            name={trail.name}
            location={trail.location}
            imageUrl={getTrailImageUrl(trail)}
            difficulty={trail.difficulty}
            length={trail.length}
            elevation={trail.elevation}
            tags={trail.tags}
            likes={trail.likes}
            strainTags={trail.strainTags}
            isAgeRestricted={trail.isAgeRestricted}
          />
        </Link>
      ))}
    </div>
  );
};

export default DiscoverTrailsList;
