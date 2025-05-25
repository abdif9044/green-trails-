
import { useMemo } from 'react';
import { TrailFilters, Trail } from '@/types/trails';

export const useTrailFilters = () => {
  const filterTrails = useMemo(() => {
    return (trails: Trail[], filters: TrailFilters): Trail[] => {
      if (!trails || trails.length === 0) return [];

      return trails.filter(trail => {
        // Search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchesSearch = 
            trail.name.toLowerCase().includes(query) ||
            trail.location.toLowerCase().includes(query) ||
            trail.description?.toLowerCase().includes(query) ||
            trail.tags.some(tag => tag.toLowerCase().includes(query));
          
          if (!matchesSearch) return false;
        }

        // Difficulty filter
        if (filters.difficulty && filters.difficulty !== '') {
          if (trail.difficulty !== filters.difficulty) return false;
        }

        // Length range filter
        if (filters.lengthRange) {
          const [minLength, maxLength] = filters.lengthRange;
          if (trail.length < minLength || trail.length > maxLength) return false;
        }

        // Country filter
        if (filters.country && filters.country !== '') {
          if (trail.country !== filters.country) return false;
        }

        // State/Province filter
        if (filters.stateProvince && filters.stateProvince !== '') {
          if (trail.state_province !== filters.stateProvince) return false;
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(filterTag =>
            trail.tags.some(trailTag => 
              trailTag.toLowerCase().includes(filterTag.toLowerCase())
            )
          );
          if (!hasMatchingTag) return false;
        }

        // Nearby coordinates filter
        if (filters.nearbyCoordinates && filters.radius && trail.coordinates) {
          const [filterLng, filterLat] = filters.nearbyCoordinates;
          const [trailLng, trailLat] = trail.coordinates;
          
          // Simple distance calculation (not perfectly accurate for long distances)
          const distance = Math.sqrt(
            Math.pow(filterLng - trailLng, 2) + Math.pow(filterLat - trailLat, 2)
          ) * 69; // Rough conversion to miles
          
          if (distance > filters.radius) return false;
        }

        return true;
      });
    };
  }, []);

  const sortTrails = useMemo(() => {
    return (trails: Trail[], sortBy: 'distance' | 'difficulty' | 'length' | 'likes' = 'likes'): Trail[] => {
      return [...trails].sort((a, b) => {
        switch (sortBy) {
          case 'difficulty':
            const difficultyOrder = { easy: 1, moderate: 2, hard: 3, expert: 4 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          case 'length':
            return a.length - b.length;
          case 'likes':
            return b.likes - a.likes;
          default:
            return 0;
        }
      });
    };
  }, []);

  return {
    filterTrails,
    sortTrails
  };
};
