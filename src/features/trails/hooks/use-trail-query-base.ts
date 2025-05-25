
import { useQuery } from '@tanstack/react-query';
import { Trail, StrainTag } from '@/types/trails';

export const formatTrailData = (trailId: string): Trail => {
  const mockStrainTags: StrainTag[] = [
    {
      id: '1',
      name: 'Blue Dream',
      type: 'hybrid',
      effects: ['relaxed', 'creative'],
      description: 'A balanced hybrid strain'
    }
  ];

  return {
    id: trailId,
    name: 'Sample Trail',
    location: 'Sample Location',
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate',
    length: 5.2,
    elevation: 1200,
    elevation_gain: 800,
    tags: ['hiking', 'scenic'],
    likes: 45,
    coordinates: [40.7128, -74.0060],
    description: 'A beautiful trail with stunning views',
    strainTags: mockStrainTags
  };
};

export const useTrailQueryBase = (trailId: string) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async (): Promise<Trail> => {
      // Mock data for now - replace with actual API call
      return formatTrailData(trailId);
    },
    enabled: !!trailId
  });
};
