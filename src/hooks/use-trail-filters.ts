
import { useMemo } from 'react';
import { Trail, TrailFilters } from '@/types/trails';

export const useTrailFilters = (trails: Trail[] = [], filters?: TrailFilters) => {
  return useMemo(() => {
    if (!filters || trails.length === 0) {
      return trails;
    }
    
    return trails.filter(trail => {
      // Filter by search query (name or location)
      if (filters.searchQuery) {
        const search = filters.searchQuery.toLowerCase();
        const nameMatch = trail.name?.toLowerCase().includes(search);
        const locationMatch = trail.location?.toLowerCase().includes(search);
        const descriptionMatch = trail.description?.toLowerCase().includes(search);
        
        if (!(nameMatch || locationMatch || descriptionMatch)) {
          return false;
        }
      }
      
      // Filter by difficulty
      if (filters.difficulty && trail.difficulty !== filters.difficulty) {
        return false;
      }
      
      // Filter by length range
      if (filters.lengthRange) {
        const [min, max] = filters.lengthRange;
        if (trail.length < min || (max < 20 && trail.length > max)) {
          return false;
        }
      }
      
      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => trail.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Filter by strain types
      if (filters.strainTypes && filters.strainTypes.length > 0 && trail.strainTags) {
        let hasMatchingStrainType = false;
        
        if (Array.isArray(trail.strainTags)) {
          if (typeof trail.strainTags[0] === 'string') {
            // If strainTags is an array of strings, we can't filter by type
            // So we'll consider it a match if it has any strain tags
            hasMatchingStrainType = trail.strainTags.length > 0;
          } else {
            // If strainTags is an array of StrainTag objects
            hasMatchingStrainType = trail.strainTags.some(strain => {
              if (typeof strain === 'string') return false;
              return filters.strainTypes?.includes(strain.type);
            });
          }
        }
        
        if (!hasMatchingStrainType) {
          return false;
        }
      }
      
      // Filter by age restriction
      if (!filters.showAgeRestricted && trail.isAgeRestricted) {
        return false;
      }
      
      return true;
    });
  }, [trails, filters]);
};
