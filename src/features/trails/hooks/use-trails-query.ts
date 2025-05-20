
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrailFilters, Trail } from '@/types/trails';
import { formatTrailData } from '@/features/trails';
import { createSampleTrails } from '../utils/sample-trail-data';

export const useTrailsQuery = (currentFilters: TrailFilters, onTrailCountChange?: (count: number) => void) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 24; // Number of trails per page

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);
      
      try {
        console.log("Fetching trails with filters:", currentFilters);
        
        // Build the query based on filters
        let query = supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              is_strain_tag,
              tag:tag_id (
                name,
                details,
                tag_type
              )
            ),
            count() OVER() as total_count
          `);
        
        // Apply filters
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
        
        // Add pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // Execute the query with pagination and ordering
        const { data, error } = await query
          .order('name', { ascending: true })
          .range(from, to);
        
        if (error) {
          console.error('Error fetching trails:', error);
          throw error;
        }
        
        console.log("Raw trails data:", data);
        
        if (!data || data.length === 0) {
          if (page === 1) {
            // Only fall back to sample data on first page and if no real data exists
            console.log("No trails found, creating sample trails");
            const sampleTrails = createSampleTrails();
            setTrails(sampleTrails);
            setTotalCount(sampleTrails.length);
            if (onTrailCountChange) {
              onTrailCountChange(sampleTrails.length);
            }
          } else {
            // No more data for this page
            setTrails([]);
          }
          return;
        }
        
        // Extract total count from the first row
        if (data.length > 0 && data[0].total_count) {
          setTotalCount(data[0].total_count);
          if (onTrailCountChange) {
            onTrailCountChange(data[0].total_count);
          }
        }
        
        // Fetch likes counts separately for the current page of trails
        const trailIds = data.map(trail => trail.id);
        const { data: likesData, error: likesError } = await supabase
          .from('trail_likes')
          .select('trail_id, id')
          .in('trail_id', trailIds);
          
        if (likesError) {
          console.warn('Error fetching trail likes:', likesError);
        }
        
        // Create a map of trail_id to like count
        const likeCountsMap: Record<string, number> = {};
        if (likesData) {
          likesData.forEach(like => {
            if (!likeCountsMap[like.trail_id]) {
              likeCountsMap[like.trail_id] = 0;
            }
            likeCountsMap[like.trail_id]++;
          });
        }
        
        // Transform the data using our common formatter with likes count
        const formattedTrails: Trail[] = data.map(trail => {
          // Add likes count from our map
          const likesCount = likeCountsMap[trail.id] || 0;
          return formatTrailData({...trail, likes_count: likesCount});
        });
        
        console.log("Formatted trails:", formattedTrails);
        setTrails(formattedTrails);
        
      } catch (error) {
        console.error('Error fetching trails:', error);
        
        // Fallback to sample data if fetching fails on first page
        if (page === 1) {
          const sampleTrails = createSampleTrails();
          setTrails(sampleTrails);
          setTotalCount(sampleTrails.length);
          if (onTrailCountChange) {
            onTrailCountChange(sampleTrails.length);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrails();
  }, [currentFilters, page, onTrailCountChange]);

  // Function to change page
  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return { 
    trails, 
    loading, 
    totalCount, 
    page, 
    pageSize, 
    changePage 
  };
};
