
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
        console.log("Fetching trails with filters:", currentFilters);
        
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
        
        if (error) {
          console.error('Error fetching trails:', error);
          throw error;
        }
        
        console.log("Raw trails data:", data);
        
        if (!data || data.length === 0) {
          // If no trails in database, create sample data for development
          console.log("No trails found, creating sample trails");
          setTrails(createSampleTrails());
          if (onTrailCountChange) {
            onTrailCountChange(5); // Sample count
          }
          return;
        }
        
        // Transform the data to match the Trail type
        const formattedTrails: Trail[] = data.map(trail => ({
          id: trail.id,
          name: trail.name || 'Unnamed Trail',
          location: trail.location || 'Unknown Location',
          imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop",
          difficulty: validateDifficulty(trail.difficulty || 'moderate'),
          length: trail.length || 0,
          elevation: trail.elevation || 0,
          tags: [], // Would need to fetch from trail_tags
          likes: 0, // Would need to fetch from trail_likes
          strainTags: [], // Would need to fetch from trail_tags where is_strain_tag is true
          isAgeRestricted: trail.is_age_restricted || false
        }));
        
        console.log("Formatted trails:", formattedTrails);
        setTrails(formattedTrails);
        
        if (onTrailCountChange) {
          onTrailCountChange(formattedTrails.length);
        }
        
      } catch (error) {
        console.error('Error fetching trails:', error);
        
        // Fallback to sample data if fetching fails
        const sampleTrails = createSampleTrails();
        setTrails(sampleTrails);
        
        if (onTrailCountChange) {
          onTrailCountChange(sampleTrails.length);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrails();
  }, [currentFilters, onTrailCountChange]);

  const handleResetFilters = () => {
    // This would be handled by the parent component
  };

  // Create sample trails data for development/fallback
  const createSampleTrails = (): Trail[] => {
    return [
      {
        id: "1",
        name: "Emerald Forest Trail",
        location: "Washington, USA",
        imageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop",
        difficulty: "easy",
        length: 3.5,
        elevation: 250,
        tags: ["forest", "waterfall", "family-friendly"],
        likes: 124,
        isAgeRestricted: false
      },
      {
        id: "2",
        name: "Mountain Ridge Path",
        location: "Colorado, USA",
        imageUrl: "https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?q=80&w=1000&auto=format&fit=crop",
        difficulty: "hard",
        length: 8.2,
        elevation: 1200,
        tags: ["mountain", "views", "challenging"],
        likes: 87,
        isAgeRestricted: false
      },
      {
        id: "3",
        name: "Cedar Loop",
        location: "Oregon, USA",
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
        difficulty: "moderate",
        length: 4.7,
        elevation: 450,
        tags: ["forest", "loop", "scenic"],
        likes: 56,
        isAgeRestricted: false
      },
      {
        id: "4",
        name: "Sunset Canyon",
        location: "Arizona, USA",
        imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop",
        difficulty: "moderate",
        length: 6.3,
        elevation: 820,
        tags: ["desert", "canyon", "sunset-views"],
        likes: 93,
        isAgeRestricted: false
      },
      {
        id: "5",
        name: "Green Valley Trek",
        location: "California, USA",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
        difficulty: "expert",
        length: 12.5,
        elevation: 2100,
        tags: ["mountain", "forest", "challenging"],
        likes: 145,
        isAgeRestricted: true
      }
    ];
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
