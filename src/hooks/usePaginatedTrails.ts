
import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters } from '@/types/trails';

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
        .order('likes', { ascending: false });

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters.lengthRange) {
        const [minLength, maxLength] = filters.lengthRange;
        query = query.gte('length', minLength).lte('length', maxLength);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.stateProvince) {
        query = query.eq('state_province', filters.stateProvince);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.nearbyCoordinates && filters.radius) {
        const [lng, lat] = filters.nearbyCoordinates;
        const latDelta = filters.radius / 69;
        const lngDelta = filters.radius / (69 * Math.cos(lat * Math.PI / 180));
        
        query = query
          .gte('coordinates->1', lat - latDelta)
          .lte('coordinates->1', lat + latDelta)
          .gte('coordinates->0', lng - lngDelta)
          .lte('coordinates->0', lng + lngDelta);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trails:', error);
        throw new Error(error.message);
      }

      const trails = (data as Trail[]) || [];
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: hasHydrated
  });

  // Hydrate on mount
  useState(() => {
    setHasHydrated(true);
  });

  // Flatten all pages into a single array of trails
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
