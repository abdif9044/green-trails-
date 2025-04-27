
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export const useSimilarTrails = (trailId: string) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT t.*
          FROM (
            SELECT * FROM json_to_recordset(
              '[
                {"id": "2", "name": "Sunrise Mountain Trail", "location": "Portland, OR", "imageUrl": "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop", "difficulty": "hard", "length": 5.8, "elevation": 1200, "tags": ["waterfall", "views", "challenging"], "likes": 189},
                {"id": "3", "name": "Riverside Path", "location": "Austin, TX", "imageUrl": "https://images.unsplash.com/photo-1523472721958-978152a13ad5?q=80&w=1000&auto=format&fit=crop", "difficulty": "easy", "length": 2.1, "elevation": 120, "tags": ["accessible", "river", "beginner"], "likes": 312},
                {"id": "5", "name": "Redwood Sanctuary Path", "location": "San Francisco, CA", "imageUrl": "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop", "difficulty": "easy", "length": 1.8, "elevation": 200, "tags": ["redwoods", "serene", "family-friendly"], "likes": 422}
              ]'::json
            ) AS x(id text, name text, location text, imageUrl text, difficulty text, length numeric, elevation numeric, tags text[], likes integer)
            WHERE x.id != $1
            LIMIT 3
          ) t
        `,
        params: JSON.stringify([trailId])
      });

      if (error) throw error;
      
      return (data || []).map(item => {
        // Explicitly type the item as a Record<string, any> to access properties
        const trail = item as Record<string, any>;
        return {
          id: String(trail.id),
          name: String(trail.name),
          location: String(trail.location),
          imageUrl: String(trail.imageurl || trail.imageUrl),
          difficulty: String(trail.difficulty),
          length: Number(trail.length),
          elevation: Number(trail.elevation),
          tags: Array.isArray(trail.tags) ? trail.tags : [],
          likes: Number(trail.likes),
          isAgeRestricted: false,
          coordinates: undefined,
          strainTags: [],
        };
      }) as Trail[];
    },
  });
};
