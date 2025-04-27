
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
    try {
      analyticsService.trackEvent('trails', 'view', trailName, {
        trailId,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking trail view:', error);
    }
  }, [user?.id]);
  
  const trackTrailLike = useCallback((trailId: string, trailName: string) => {
    try {
      analyticsService.trackEvent('trails', 'like', trailName, {
        trailId,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking trail like:', error);
    }
  }, [user?.id]);
  
  const trackTrailComment = useCallback((trailId: string) => {
    try {
      analyticsService.trackEvent('trails', 'comment', undefined, {
        trailId,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking trail comment:', error);
    }
  }, [user?.id]);
  
  const trackTrailRating = useCallback((trailId: string, rating: number) => {
    try {
      analyticsService.trackEvent('trails', 'rate', undefined, {
        trailId,
        rating,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking trail rating:', error);
    }
  }, [user?.id]);
  
  const trackSearch = useCallback((query: string, resultCount: number) => {
    try {
      analyticsService.trackEvent('search', 'search', query, {
        resultCount,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }, [user?.id]);

  const trackFilterUse = useCallback((filterType: string, filterValue: string) => {
    try {
      analyticsService.trackEvent('search', 'filter', filterType, {
        filterValue,
        userId: user?.id || 'anonymous',
      });
    } catch (error) {
      console.error('Error tracking filter use:', error);
    }
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
