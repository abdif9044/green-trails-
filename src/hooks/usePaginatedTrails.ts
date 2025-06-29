
import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters, DatabaseTrail } from '@/types/trails';

interface UsePaginatedTrailsOptions {
  filters: TrailFilters;
  pageSize?: number;
}

export const usePaginatedTrails = ({ filters, pageSize = 12 }: UsePaginatedTrailsOptions) => {
  const [hasHydrated, setHasHydrated] = useState(false);

  const fetchTrails = useCallback(async ({ pageParam = 0 }): Promise<{
    trails: Trail[];
    nextCursor: number | null;
    hasMore: boolean;
  }> => {
    console.log('Fetching trails page:', pageParam, 'with filters:', filters);
    
    try {
      let query = supabase
        .from('trails')
        .select('*')
        .range(pageParam, pageParam + pageSize - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Handle difficulty filter - map expert to hard for database query and handle empty strings
      if (filters.difficulty && filters.difficulty.trim() !== '') {
        const dbDifficulty = filters.difficulty === 'expert' ? 'hard' : filters.difficulty;
        // Only apply filter if it's a valid database difficulty
        if (['easy', 'moderate', 'hard'].includes(dbDifficulty)) {
          query = query.eq('difficulty', dbDifficulty);
        }
      }

      if (filters.lengthRange) {
        const [minLength, maxLength] = filters.lengthRange;
        query = query.gte('length', minLength).lte('length', maxLength);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trails:', error);
        throw new Error(error.message);
      }

      // Transform database trails to match Trail interface
      const trails: Trail[] = (data || []).map((trail: DatabaseTrail) => ({
        id: trail.id,
        name: trail.name,
        location: trail.location || 'Unknown Location',
        description: trail.description || '',
        difficulty: trail.difficulty,
        length: Number(trail.length) || 0,
        elevation_gain: trail.elevation_gain || 0,
        latitude: trail.latitude || trail.lat || 0,
        longitude: trail.longitude || trail.lon || 0,
        coordinates: [trail.longitude || trail.lon || 0, trail.latitude || trail.lat || 0] as [number, number],
        tags: [],
        likes: Math.floor(Math.random() * 200) + 50,
        imageUrl: '/placeholder.svg',
        category: trail.category,
        country: trail.country,
        region: trail.region,
        is_age_restricted: trail.is_age_restricted,
        is_verified: trail.is_verified,
        created_at: trail.created_at,
        updated_at: trail.updated_at
      }));

      const hasMore = trails.length === pageSize;
      const nextCursor = hasMore ? pageParam + pageSize : null;

      console.log(`Fetched ${trails.length} trails, hasMore: ${hasMore}`);
      
      return {
        trails,
        nextCursor,
        hasMore
      };
    } catch (error) {
      console.error('Error in fetchTrails:', error);
      throw error;
    }
  }, [filters, pageSize]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['paginated-trails', filters],
    queryFn: fetchTrails,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: hasHydrated
  });

  // Hydrate on mount
  useState(() => {
    setHasHydrated(true);
  });

  const trails = data?.pages.flatMap(page => page.trails) ?? [];

  return {
    trails,
    error,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
    totalCount: trails.length
  };
};
