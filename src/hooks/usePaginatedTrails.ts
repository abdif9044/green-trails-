
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  distance: number;
  elevation_gain: number;
  description?: string;
  country?: string;
  imageUrl?: string;
  tags?: string[];
  likes?: number;
}

interface TrailFilters {
  difficulty?: string[];
  minDistance?: number;
  maxDistance?: number;
  search?: string;
  location?: string;
  tags?: string[];
}

export const usePaginatedTrails = (
  filters: TrailFilters = {},
  pageSize = 20
) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { toast } = useToast();

  const loadTrails = async (pageNum = 0, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('trails')
        .select('*')
        .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.difficulty && filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty);
      }
      if (filters.minDistance) {
        query = query.gte('length', filters.minDistance);
      }
      if (filters.maxDistance) {
        query = query.lte('length', filters.maxDistance);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform database records to Trail interface
      const transformedTrails = (data || []).map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location,
        difficulty: trail.difficulty,
        distance: trail.length || trail.trail_length || 0, // Use available distance field
        elevation_gain: trail.elevation_gain,
        description: trail.description,
        country: trail.country,
        imageUrl: undefined, // No image_url field in current schema
        tags: [], // Default empty array
        likes: 0, // Default to 0
      }));

      if (append) {
        setTrails(prev => [...prev, ...transformedTrails]);
      } else {
        setTrails(transformedTrails);
      }

      setHasMore(transformedTrails.length === pageSize);
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load trails';
      setError(errorMessage);
      toast({
        title: 'Error loading trails',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadTrails(page + 1, true);
    }
  };

  const refresh = () => {
    setPage(0);
    loadTrails(0, false);
  };

  useEffect(() => {
    refresh();
  }, [
    filters.difficulty,
    filters.minDistance,
    filters.maxDistance,
    filters.search,
    filters.location,
    filters.tags,
  ]);

  return {
    trails,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
