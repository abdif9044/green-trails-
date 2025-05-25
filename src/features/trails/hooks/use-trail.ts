
import { useQuery } from '@tanstack/react-query';
import { Trail } from '@/types/trails';
import { formatTrailFromDatabase } from '@/utils/trail-formatter';

export const useTrail = (trailId: string) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async (): Promise<Trail> => {
      // Mock data for now - replace with actual API call
      // This would normally fetch from your database
      const mockDbTrail = {
        id: trailId,
        name: 'Sample Trail',
        location: 'Sample Location',
        description: 'A beautiful trail with stunning views',
        difficulty: 'moderate',
        elevation: 1200,
        elevation_gain: 800,
        trail_length: 5.2,
        latitude: 40.7128,
        longitude: -74.0060,
        country: 'US',
        region: 'Northeast',
        terrain_type: 'mountain',
        is_age_restricted: false,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user',
        geojson: null,
        trail_tags: [
          { tag_name: 'hiking' },
          { tag_name: 'scenic' }
        ]
      };
      
      return formatTrailFromDatabase(mockDbTrail);
    },
    enabled: !!trailId
  });
};
