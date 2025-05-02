
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { TrailCard } from "@/features/trails";
import { TrailDifficulty, TrailFilters, Trail } from '@/types/trails';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { validateDifficulty } from '@/features/trails';

export interface DiscoverTrailsListProps {
  currentFilters: TrailFilters;
  viewMode: 'list' | 'map';
  onTrailCountChange?: (count: number) => void;
}

const DiscoverTrailsList: React.FC<DiscoverTrailsListProps> = ({ 
  currentFilters, 
  viewMode,
  onTrailCountChange
}) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);
      
      try {
        // Build the query based on filters
        let query = supabase.from('trails').select('*');
        
        if (currentFilters.searchQuery) {
          query = query.ilike('name', `%${currentFilters.searchQuery}%`);
        }
        
        if (currentFilters.difficulty) {
          query = query.eq('difficulty', currentFilters.difficulty);
        }
        
        if (currentFilters.lengthRange) {
          query = query
            .gte('length', currentFilters.lengthRange[0])
            .lte('length', currentFilters.lengthRange[1]);
        }
        
        if (currentFilters.country) {
          query = query.eq('country', currentFilters.country);
        }
        
        if (currentFilters.stateProvince) {
          query = query.eq('state_province', currentFilters.stateProvince);
        }
        
        if (!currentFilters.showAgeRestricted) {
          query = query.eq('is_age_restricted', false);
        }
        
        // Execute the query
        const { data, error } = await query.limit(20);
        
        if (error) throw error;
        
        // Transform the data to match the Trail type
        const formattedTrails: Trail[] = data.map(trail => ({
          id: trail.id,
          name: trail.name,
          location: trail.location,
          imageUrl: null, // Would need to fetch from trail_images
          difficulty: validateDifficulty(trail.difficulty),
          length: trail.length,
          elevation: trail.elevation,
          tags: [], // Would need to fetch from trail_tags
          likes: 0, // Would need to fetch from trail_likes
          strainTags: [], // Would need to fetch from trail_tags where is_strain_tag is true
          isAgeRestricted: trail.is_age_restricted || false
        }));
        
        setTrails(formattedTrails);
        if (onTrailCountChange) {
          onTrailCountChange(formattedTrails.length);
        }
        
      } catch (error) {
        console.error('Error fetching trails:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrails();
  }, [currentFilters, onTrailCountChange]);

  const handleResetFilters = () => {
    // Call the parent component's filter reset function
  };

  if (loading) {
    return <div className="py-12 text-center">Loading trails...</div>;
  }

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
        <Button onClick={handleResetFilters}>
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
            imageUrl={trail.imageUrl}
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
