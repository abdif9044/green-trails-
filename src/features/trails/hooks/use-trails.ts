
import { useQuery } from '@tanstack/react-query';
import { Trail, TrailFilters } from '@/types/trails';

export const useTrails = (filters: TrailFilters = {}) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: async (): Promise<Trail[]> => {
      // Mock data for now - replace with actual API call
      const mockTrails: Trail[] = [
        {
          id: '1',
          name: 'Mountain Peak Trail',
          location: 'Colorado, USA',
          imageUrl: '/placeholder.svg',
          difficulty: 'hard',
          length: 8.5,
          elevation: 2400,
          elevation_gain: 1200,
          tags: ['mountain', 'peak', 'challenging'],
          likes: 89,
          coordinates: [39.7392, -104.9903]
        },
        {
          id: '2',
          name: 'Forest Loop',
          location: 'Oregon, USA',
          imageUrl: '/placeholder.svg',
          difficulty: 'easy',
          length: 3.2,
          elevation: 400,
          elevation_gain: 200,
          tags: ['forest', 'loop', 'family-friendly'],
          likes: 45,
          coordinates: [45.5152, -122.6784]
        }
      ];

      // Apply filters
      let filteredTrails = mockTrails;
      
      if (filters.searchQuery) {
        filteredTrails = filteredTrails.filter(trail => 
          trail.name.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
          trail.location.toLowerCase().includes(filters.searchQuery!.toLowerCase())
        );
      }
      
      if (filters.difficulty) {
        filteredTrails = filteredTrails.filter(trail => trail.difficulty === filters.difficulty);
      }

      return filteredTrails;
    }
  });
};
