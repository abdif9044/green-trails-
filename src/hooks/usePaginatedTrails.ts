
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
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      if (filters.difficulty && ['easy', 'moderate', 'hard'].includes(filters.difficulty)) {
        query = query.eq('difficulty', filters.difficulty as 'easy' | 'moderate' | 'hard');
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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trails:', error);
        throw new Error(error.message);
      }

      // Transform database trails to match Trail interface
      const trails: Trail[] = (data || []).map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location || 'Unknown Location',
        imageUrl: '/placeholder.svg',
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(trail.length) || 0,
        elevation: trail.elevation_gain || 0,
        elevation_gain: trail.elevation_gain || 0,
        tags: [], // Default empty array since trails table doesn't have tags column
        likes: Math.floor(Math.random() * 200) + 50,
        coordinates: [trail.longitude || 0, trail.latitude || 0] as [number, number],
        description: trail.description || 'A beautiful trail waiting to be explored.'
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
