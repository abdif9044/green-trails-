
import { useCallback } from 'react';
import analyticsService from '@/services/analytics-service';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook for tracking user analytics events
 * @returns Methods for tracking various user interactions
 */
export const useAnalytics = () => {
  const { user } = useAuth();
  
  const trackTrailView = useCallback((trailId: string, trailName: string) => {
    analyticsService.trackEvent('trails', 'view', trailName, {
      trailId,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);
  
  const trackTrailLike = useCallback((trailId: string, trailName: string) => {
    analyticsService.trackEvent('trails', 'like', trailName, {
      trailId,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);
  
  const trackTrailComment = useCallback((trailId: string) => {
    analyticsService.trackEvent('trails', 'comment', undefined, {
      trailId,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);
  
  const trackTrailRating = useCallback((trailId: string, rating: number) => {
    analyticsService.trackEvent('trails', 'rate', undefined, {
      trailId,
      rating,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);
  
  const trackSearch = useCallback((query: string, resultCount: number) => {
    analyticsService.trackEvent('search', 'search', query, {
      resultCount,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);

  const trackFilterUse = useCallback((filterType: string, filterValue: string) => {
    analyticsService.trackEvent('search', 'filter', filterType, {
      filterValue,
      userId: user?.id || 'anonymous',
    });
  }, [user?.id]);
  
  return {
    trackTrailView,
    trackTrailLike,
    trackTrailComment,
    trackTrailRating,
    trackSearch,
    trackFilterUse,
  };
};
