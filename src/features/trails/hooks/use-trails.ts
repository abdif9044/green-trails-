
import { useQuery } from '@tanstack/react-query';
import { Trail } from '@/types/trails';

export const useTrails = () => {
  return useQuery({
    queryKey: ['trails'],
    queryFn: async (): Promise<Trail[]> => {
      // Mock trail data with all required properties
      return [
        {
          id: '1',
          name: 'Mountain Peak Trail',
          location: 'Rocky Mountains, CO',
          description: 'A challenging trail with spectacular mountain views',
          imageUrl: '/placeholder.svg',
          difficulty: 'hard' as const,
          length: 8.5,
          elevation: 2400,
          elevation_gain: 2400,
          latitude: 39.7392,
          longitude: -104.9903,
          tags: ['mountain', 'scenic', 'challenging'],
          likes: 142,
          coordinates: [-104.9903, 39.7392] as [number, number],
        },
        {
          id: '2',
          name: 'Forest Loop',
          location: 'Pine Forest, OR',
          description: 'A gentle walk through beautiful pine forest',
          imageUrl: '/placeholder.svg',
          difficulty: 'easy' as const,
          length: 3.2,
          elevation: 200,
          elevation_gain: 200,
          latitude: 45.5152,
          longitude: -122.6784,
          tags: ['forest', 'easy', 'family-friendly'],
          likes: 89,
          coordinates: [-122.6784, 45.5152] as [number, number],
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
