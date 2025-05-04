import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Trail } from '@/types/trails';
import { supabase } from '@/integrations/supabase/client';
import { formatTrailData } from '@/features/trails/hooks/use-trail-query-base';

/**
 * Utility for prefetching data to improve app performance
 */
export const usePrefetchUtils = () => {
  const queryClient = useQueryClient();
  
  /**
   * Prefetch a trail by ID
   */
  const prefetchTrail = useCallback(async (trailId: string) => {
    if (!trailId) return;
    
    // Skip if already in cache
    if (queryClient.getQueryData(['trail', trailId])) return;
    
    // Prefetch trail data
    queryClient.prefetchQuery({
      queryKey: ['trail', trailId],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('trails')
            .select(`
              *,
              trail_tags (
                id,
                tag,
                is_strain_tag
              )
            `)
            .eq('id', trailId)
            .single();
  
          if (error) {
            console.error('Error prefetching trail:', error);
            return null;
          }
  
          if (!data) {
            return null;
          }
  
          // Format trail data
          const trail: Trail = formatTrailData(data);
  
          return trail;
        } catch (error) {
          console.error('Error in prefetchTrail:', error);
          return null;
        }
      }
    });
  }, [queryClient]);
  
  /**
   * Prefetch similar trails for a trail
   */
  const prefetchSimilarTrails = useCallback(async (trailId: string) => {
    if (!trailId) return;
    
    // Skip if already in cache
    if (queryClient.getQueryData(['similar-trails', trailId])) return;
    
    // Prefetch similar trails
    queryClient.prefetchQuery({
      queryKey: ['similar-trails', trailId],
      queryFn: async () => {
        // Implementation would depend on your similar trails logic
        // This is a simplified version
        try {
          const { data, error } = await supabase
            .from('trails')
            .select('*')
            .limit(4);
            
          if (error) {
            console.error('Error prefetching similar trails:', error);
            return [];
          }
          
          return data.map(formatTrailData);
        } catch (error) {
          console.error('Error in prefetchSimilarTrails:', error);
          return [];
        }
      }
    });
  }, [queryClient]);
  
  /**
   * Prefetch weather data for a trail
   */
  const prefetchTrailWeather = useCallback(async (trailId: string, coordinates?: [number, number]) => {
    if (!trailId || !coordinates) return;
    
    // Skip if already in cache
    if (queryClient.getQueryData(['trail-weather', trailId])) return;
    
    // Prefetch weather data
    queryClient.prefetchQuery({
      queryKey: ['trail-weather', trailId],
      queryFn: async () => {
        try {
          // Check for cached weather data first
          const { data: existingData } = await supabase
            .from('trail_weather')
            .select('*')
            .eq('trail_id', trailId)
            .single();
            
          if (existingData) {
            return {
              temperature: existingData.temperature,
              condition: existingData.condition,
              high: existingData.high,
              low: existingData.low,
              precipitation: existingData.precipitation,
              sunrise: existingData.sunrise,
              sunset: existingData.sunset,
              windSpeed: existingData.wind_speed,
              windDirection: existingData.wind_direction
            };
          }
          
          // Otherwise we'd fetch from the API, but we'll skip that for prefetching
          return null;
        } catch (error) {
          console.error('Error in prefetchTrailWeather:', error);
          return null;
        }
      },
      staleTime: 1000 * 60 * 15 // 15 minutes
    });
  }, [queryClient]);
  
  /**
   * Prefetch all related data for a trail
   */
  const prefetchTrailPage = useCallback(async (trailId: string, coordinates?: [number, number]) => {
    if (!trailId) return;
    
    await Promise.all([
      prefetchTrail(trailId),
      coordinates ? prefetchTrailWeather(trailId, coordinates) : Promise.resolve(),
      prefetchSimilarTrails(trailId)
    ]);
  }, [prefetchTrail, prefetchTrailWeather, prefetchSimilarTrails]);
  
  return {
    prefetchTrail,
    prefetchSimilarTrails,
    prefetchTrailWeather,
    prefetchTrailPage
  };
};
