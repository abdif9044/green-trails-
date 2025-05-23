
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trail, TrailFilters } from '@/types/trails';
import { formatTrailData } from '@/features/trails';
import { cacheService } from '@/services/cache/CacheService';

export function usePaginatedTrails(filters?: TrailFilters, pageSize: number = 12) {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const cacheKey = `trails_${JSON.stringify(filters)}_${page}`;

  const loadTrails = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      // Check cache first
      const cached = cacheService.get<{ trails: Trail[], hasMore: boolean }>(cacheKey);
      if (cached && !isLoadMore) {
        if (pageNum === 0) {
          setTrails(cached.trails);
        }
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Get total count for pagination
      let countQuery = supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      // Apply filters to count query
      if (filters?.searchQuery) {
        countQuery = countQuery.ilike('name', `%${filters.searchQuery}%`);
      }
      if (filters?.difficulty) {
        countQuery = countQuery.eq('difficulty', filters.difficulty);
      }
      if (filters?.lengthRange) {
        countQuery = countQuery
          .gte('length', filters.lengthRange[0])
          .lte('length', filters.lengthRange[1]);
      }
      if (filters?.country) {
        countQuery = countQuery.eq('country', filters.country);
      }
      if (filters?.stateProvince) {
        countQuery = countQuery.eq('state_province', filters.stateProvince);
      }
      if (!filters?.showAgeRestricted) {
        countQuery = countQuery.eq('is_age_restricted', false);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Fetch trails data
      let dataQuery = supabase
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
          )
        `);

      // Apply same filters to data query
      if (filters?.searchQuery) {
        dataQuery = dataQuery.ilike('name', `%${filters.searchQuery}%`);
      }
      if (filters?.difficulty) {
        dataQuery = dataQuery.eq('difficulty', filters.difficulty);
      }
      if (filters?.lengthRange) {
        dataQuery = dataQuery
          .gte('length', filters.lengthRange[0])
          .lte('length', filters.lengthRange[1]);
      }
      if (filters?.country) {
        dataQuery = dataQuery.eq('country', filters.country);
      }
      if (filters?.stateProvince) {
        dataQuery = dataQuery.eq('state_province', filters.stateProvince);
      }
      if (!filters?.showAgeRestricted) {
        dataQuery = dataQuery.eq('is_age_restricted', false);
      }

      const from = pageNum * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching trails:', error);
        throw error;
      }

      const formattedTrails = data?.map(formatTrailData) || [];
      const hasMoreData = formattedTrails.length === pageSize && from + pageSize < (count || 0);

      if (isLoadMore) {
        setTrails(prev => [...prev, ...formattedTrails]);
      } else {
        setTrails(formattedTrails);
      }
      
      setHasMore(hasMoreData);

      // Cache the result
      cacheService.set(cacheKey, { 
        trails: formattedTrails, 
        hasMore: hasMoreData 
      }, 2 * 60 * 1000); // 2 minutes cache

    } catch (error) {
      console.error('Error loading trails:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize, cacheKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTrails(nextPage, true);
    }
  }, [page, loading, hasMore, loadTrails]);

  const resetPagination = useCallback(() => {
    setPage(0);
    setTrails([]);
    setHasMore(true);
    loadTrails(0, false);
  }, [loadTrails]);

  useEffect(() => {
    resetPagination();
  }, [filters]);

  return {
    trails,
    loading,
    hasMore,
    totalCount,
    loadMore,
    resetPagination
  };
}
