
import { Trail, TrailFilters } from "@/types/trails";

export const useTrailFilters = (trails: Trail[], filters?: TrailFilters) => {
  if (!filters) return trails;

  let filtered = [...trails];

  if (filters.searchQuery && filters.searchQuery !== '') {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(trail => 
      trail.name.toLowerCase().includes(query) ||
      trail.location.toLowerCase().includes(query) ||
      trail.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (trail.strainTags && trail.strainTags.some(tag => 
        typeof tag === 'string' ? tag.toLowerCase().includes(query) : tag.name.toLowerCase().includes(query)
      ))
    );
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(trail => trail.difficulty === filters.difficulty);
  }

  if (filters.lengthRange) {
    filtered = filtered.filter(trail => 
      trail.length >= filters.lengthRange![0] && trail.length <= filters.lengthRange![1]
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(trail => 
      filters.tags!.some(tag => trail.tags.includes(tag))
    );
  }

  if (filters.showAgeRestricted === false) {
    filtered = filtered.filter(trail => !trail.isAgeRestricted);
  }

  return filtered;
};
