
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export const useSimilarTrails = (trailId: string, currentTrail?: Trail) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async (): Promise<Trail[]> => {
      if (!currentTrail) return [];

      // Map difficulty types properly - ensure we use valid enum values
      const difficultyMapping: Record<string, 'easy' | 'moderate' | 'hard'> = {
        'expert': 'hard',
        'difficult': 'hard',
        'intermediate': 'moderate',
        'beginner': 'easy'
      };
      
      const mappedDifficulty = difficultyMapping[currentTrail.difficulty] || currentTrail.difficulty as 'easy' | 'moderate' | 'hard';

      // Ensure we have a valid difficulty value
      if (!['easy', 'moderate', 'hard'].includes(mappedDifficulty)) {
        console.warn('Invalid difficulty level:', currentTrail.difficulty);
        // Return mock trails if difficulty is invalid
        return getMockSimilarTrails(currentTrail);
      }

      try {
        const { data: dbTrails, error } = await supabase
          .from('trails')
          .select('*')
          .neq('id', trailId)
          .eq('difficulty', mappedDifficulty)
          .limit(6);

        if (error) {
          console.error('Error fetching similar trails:', error);
          return getMockSimilarTrails(currentTrail);
        }

        if (dbTrails && dbTrails.length > 0) {
          return dbTrails.map(trail => ({
            id: trail.id,
            name: trail.name,
            location: trail.location || 'Unknown Location',
            imageUrl: '/placeholder.svg',
            difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
            length: Number(trail.length) || 0,
            elevation: trail.elevation_gain || 0,
            elevation_gain: trail.elevation_gain || 0,
            latitude: trail.latitude || trail.lat || 0,
            longitude: trail.longitude || trail.lon || 0,
            tags: [],
            likes: Math.floor(Math.random() * 200) + 50,
            coordinates: [
              trail.longitude || trail.lon || 0,
              trail.latitude || trail.lat || 0
            ] as [number, number],
            description: trail.description || 'A beautiful trail similar to your current selection.'
          })) as Trail[];
        }
      } catch (error) {
        console.error('Database query failed:', error);
      }

      return getMockSimilarTrails(currentTrail);
    },
    enabled: !!currentTrail,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper function for mock similar trails
const getMockSimilarTrails = (currentTrail: Trail): Trail[] => {
  return [
    {
      id: 'similar-1',
      name: 'Pine Ridge Trail',
      location: 'Similar National Park',
      imageUrl: '/placeholder.svg',
      difficulty: 'moderate' as const,
      length: currentTrail.length * 0.8,
      elevation: currentTrail.elevation * 0.9,
      elevation_gain: currentTrail.elevation_gain * 0.9,
      latitude: (currentTrail.latitude || 0) + 0.1,
      longitude: (currentTrail.longitude || 0) + 0.1,
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
      elevation: currentTrail.elevation * 1.1,
      elevation_gain: currentTrail.elevation_gain * 1.1,
      latitude: (currentTrail.latitude || 0) - 0.1,
      longitude: (currentTrail.longitude || 0) - 0.1,
      tags: [],
      likes: Math.floor(Math.random() * 200) + 50,
      coordinates: [
        (currentTrail.coordinates?.[0] || 0) - 0.1,
        (currentTrail.coordinates?.[1] || 0) - 0.1
      ] as [number, number],
      description: 'Another great option with similar characteristics.'
    }
  ];
};
