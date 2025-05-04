
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trail } from '@/types/trails';
import { DetailedWeatherData } from '@/features/weather/types/weather-types';

/**
 * Hook to prefetch data for trails to improve perceived performance
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch trail data for a specific trail ID
   */
  const prefetchTrail = useCallback(
    async (trailId: string) => {
      if (!queryClient.getQueryData(['trail', trailId])) {
        await queryClient.prefetchQuery({
          queryKey: ['trail', trailId],
          queryFn: async () => {
            try {
              const response = await fetch(`/api/trails/${trailId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            } catch (error) {
              console.error("Error prefetching trail:", error);
              return null;
            }
          },
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
      }
    },
    [queryClient]
  );

  /**
   * Prefetch similar trails for a specific trail ID
   */
  const prefetchSimilarTrails = useCallback(
    async (trailId: string) => {
      if (!queryClient.getQueryData(['similar-trails', trailId])) {
        await queryClient.prefetchQuery({
          queryKey: ['similar-trails', trailId],
          queryFn: async () => {
            try {
              // Direct query to fetch similar trails data
              const result = await fetch(`/api/trails/${trailId}/similar`);
              if (!result.ok) {
                return [];
              }
              return await result.json();
            } catch (error) {
              console.error("Error prefetching similar trails:", error);
              return [];
            }
          },
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
      }
    },
    [queryClient]
  );

  /**
   * Prefetch weather data for a specific trail
   */
  const prefetchWeatherData = useCallback(
    async (trailId: string, coordinates: [number, number]) => {
      if (!queryClient.getQueryData(['trail-detailed-weather', trailId])) {
        await queryClient.prefetchQuery({
          queryKey: ['trail-detailed-weather', trailId],
          queryFn: async () => {
            try {
              // Direct query to fetch weather data
              const result = await fetch(`/api/trails/${trailId}/weather`);
              if (!result.ok) {
                return null;
              }
              return await result.json() as DetailedWeatherData;
            } catch (error) {
              console.error("Error prefetching weather data:", error);
              return null;
            }
          },
          staleTime: 1000 * 60 * 30, // 30 minutes
        });
      }
    },
    [queryClient]
  );

  return {
    prefetchTrail,
    prefetchSimilarTrails,
    prefetchWeatherData,
  };
};
