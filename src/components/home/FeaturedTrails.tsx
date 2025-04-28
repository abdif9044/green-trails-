
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import TrailCardPrefetch from "@/components/TrailCardPrefetch";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrailDifficulty } from "@/types/trails";

const useFeaturedTrails = () => {
  return useQuery({
    queryKey: ['featured-trails'],
    queryFn: async () => {
      const { data: trails, error } = await supabase
        .from('trails')
        .select(`
          *,
          trail_images (
            image_path,
            is_primary
          ),
          trail_tags (
            tag,
            is_strain_tag
          )
        `)
        .eq('location', 'Rochester, MN')
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count likes for each trail
      const trailsWithLikes = await Promise.all(
        trails.map(async (trail) => {
          const { count } = await supabase
            .from('trail_likes')
            .select('*', { count: 'exact', head: true })
            .eq('trail_id', trail.id);
            
          return {
            ...trail,
            likesCount: count || 0
          };
        })
      );

      return trailsWithLikes.map(trail => {
        // Ensure the difficulty is cast to a valid TrailDifficulty type
        const difficulty = validateDifficulty(trail.difficulty);
        
        return {
          id: trail.id,
          name: trail.name,
          location: trail.location,
          coordinates: [trail.longitude, trail.latitude] as [number, number],
          imageUrl: trail.trail_images?.[0]?.image_path 
            ? supabase.storage
                .from('trail_images')
                .getPublicUrl(trail.trail_images[0].image_path)
                .data.publicUrl
            : "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
          difficulty: difficulty,
          length: trail.length,
          elevation: trail.elevation,
          tags: trail.trail_tags
            ?.filter(tag => !tag.is_strain_tag)
            .map(tag => tag.tag) || [],
          strainTags: trail.trail_tags
            ?.filter(tag => tag.is_strain_tag)
            .map(tag => tag.tag) || [],
          isAgeRestricted: trail.is_age_restricted,
          description: trail.description,
          likes: trail.likesCount,
        };
      });
    }
  });
};

// Helper function to validate and convert string difficulty to TrailDifficulty type
const validateDifficulty = (difficulty: string): TrailDifficulty => {
  const validDifficulties: TrailDifficulty[] = ['easy', 'moderate', 'hard', 'expert'];
  
  if (validDifficulties.includes(difficulty as TrailDifficulty)) {
    return difficulty as TrailDifficulty;
  }
  
  // Default to 'moderate' if the difficulty is not valid
  console.warn(`Invalid difficulty: ${difficulty}, defaulting to 'moderate'`);
  return 'moderate';
};

const FeaturedTrails = () => {
  const { data: trails, isLoading } = useFeaturedTrails();

  return (
    <section className="py-16 bg-white dark:bg-greentrail-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200">
            Featured Minnesota Trails
          </h2>
          <Link to="/discover">
            <Button 
              variant="ghost" 
              className="text-greentrail-600 hover:text-greentrail-800 hover:bg-greentrail-100 dark:text-greentrail-400 dark:hover:text-greentrail-200 dark:hover:bg-greentrail-900"
            >
              View All <Compass className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails?.map((trail) => (
            <TrailCardPrefetch
              key={trail.id}
              {...trail}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrails;
