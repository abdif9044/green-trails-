
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export const useSimilarTrails = (trailId: string, currentTrail?: Trail) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async (): Promise<Trail[]> => {
      if (!currentTrail) return [];

      // Map difficulty types properly
      const difficultyMap: Record<string, string> = {
        'expert': 'hard'
      };
      
      const mappedDifficulty = difficultyMap[currentTrail.difficulty] || currentTrail.difficulty;

      // Try to get similar trails from the database
      const { data: dbTrails, error } = await supabase
        .from('trails')
        .select('*')
        .neq('id', trailId)
        .eq('difficulty', mappedDifficulty)
        .limit(6);

      if (error) {
        console.error('Error fetching similar trails:', error);
      }

      if (dbTrails && dbTrails.length > 0) {
        // Transform database trails to match Trail interface
        return dbTrails.map(trail => ({
          id: trail.id,
          name: trail.name,
          location: trail.location || 'Unknown Location',
          imageUrl: '/placeholder.svg',
          difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
          length: Number(trail.length) || 0,
          elevation: trail.elevation_gain || 0,
          elevation_gain: trail.elevation_gain || 0,
          tags: [],
          likes: Math.floor(Math.random() * 200) + 50,
          coordinates: [
            trail.lon || 0,
            trail.lat || 0
          ] as [number, number],
          description: trail.description || 'A beautiful trail similar to your current selection.'
        })) as Trail[];
      }

      // Fallback to mock similar trails
      const mockSimilarTrails: Trail[] = [
        {
          id: 'similar-1',
          name: 'Pine Ridge Trail',
          location: 'Similar National Park',
          imageUrl: '/placeholder.svg',
          difficulty: 'moderate' as const,
          length: currentTrail.length * 0.8,
          elevation: currentTrail.elevation,
          elevation_gain: currentTrail.elevation_gain * 0.9,
          tags: [],
          likes: Math.floor(Math.random() * 200) + 50,
          coordinates: [
            (currentTrail.coordinates?.[0] || 0) + 0.1,
            (currentTrail.coordinates?.[1] || 0) + 0.1
          ] as [number, number],
          description: 'A beautiful trail similar to your current selection.'
        },
        {
          id: 'similar-2',
          name: 'Valley View Path',
          location: 'Nearby State Park',
          imageUrl: '/placeholder.svg',
          difficulty: 'moderate' as const,
          length: currentTrail.length * 1.2,
          elevation: currentTrail.elevation,
          elevation_gain: currentTrail.elevation_gain * 1.1,
          tags: [],
          likes: Math.floor(Math.random() * 200) + 50,
          coordinates: [
            (currentTrail.coordinates?.[0] || 0) - 0.1,
            (currentTrail.coordinates?.[1] || 0) - 0.1
          ] as [number, number],
          description: 'Another great option with similar characteristics.'
        }
      ];

      return mockSimilarTrails;
    },
    enabled: !!currentTrail,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
