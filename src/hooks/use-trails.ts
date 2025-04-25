
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Trail = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length: number;
  elevation: number;
  tags: string[];
  likes: number;
  coordinates?: [number, number]; // [longitude, latitude]
};

export const useTrails = (filters?: {
  searchQuery?: string;
  difficulty?: string | null;
  lengthRange?: [number, number];
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: async () => {
      // In a production app, this would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTrails = [
        {
          id: "1",
          name: "Emerald Forest Loop",
          location: "Boulder, CO",
          coordinates: [-105.2839, 40.0202] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
          difficulty: "moderate",
          length: 3.2,
          elevation: 450,
          tags: ["scenic", "forest", "dog-friendly"],
          likes: 241
        },
        {
          id: "2",
          name: "Sunrise Mountain Trail",
          location: "Portland, OR",
          coordinates: [-122.7162, 45.5202] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop",
          difficulty: "hard",
          length: 5.8,
          elevation: 1200,
          tags: ["waterfall", "views", "challenging"],
          likes: 189
        },
        {
          id: "3",
          name: "Riverside Path",
          location: "Austin, TX",
          coordinates: [-97.7431, 30.2672] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1523472721958-978152a13ad5?q=80&w=1000&auto=format&fit=crop",
          difficulty: "easy",
          length: 2.1,
          elevation: 120,
          tags: ["accessible", "river", "beginner"],
          likes: 312
        },
        {
          id: "4",
          name: "Mountain Creek Trail",
          location: "Seattle, WA",
          coordinates: [-122.3301, 47.6038] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1000&auto=format&fit=crop",
          difficulty: "moderate",
          length: 4.3,
          elevation: 850,
          tags: ["creek", "forest", "wildlife"],
          likes: 178
        },
        {
          id: "5",
          name: "Redwood Sanctuary Path",
          location: "San Francisco, CA",
          coordinates: [-122.4194, 37.7749] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
          difficulty: "easy",
          length: 1.8,
          elevation: 200,
          tags: ["redwoods", "serene", "family-friendly"],
          likes: 422
        },
        {
          id: "6",
          name: "Alpine Summit Route",
          location: "Denver, CO",
          coordinates: [-104.9903, 39.7392] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
          difficulty: "expert",
          length: 7.6,
          elevation: 2800,
          tags: ["alpine", "views", "challenging"],
          likes: 97
        },
      ];
      
      // Apply filters
      let filtered = [...mockTrails];
      
      if (filters) {
        // Text search
        if (filters.searchQuery && filters.searchQuery !== '') {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(trail => 
            trail.name.toLowerCase().includes(query) ||
            trail.location.toLowerCase().includes(query) ||
            trail.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        // Difficulty filter
        if (filters.difficulty && filters.difficulty !== 'all') {
          filtered = filtered.filter(trail => trail.difficulty === filters.difficulty);
        }
        
        // Length filter
        if (filters.lengthRange) {
          filtered = filtered.filter(trail => 
            trail.length >= filters.lengthRange[0] && trail.length <= filters.lengthRange[1]
          );
        }
        
        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter(trail => 
            filters.tags!.some(tag => trail.tags.includes(tag))
          );
        }
      }
      
      return filtered;
    }
  });
};

export const useTrail = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async () => {
      if (!trailId) return null;
      
      // In a production app, this would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTrails = [
        {
          id: "1",
          name: "Emerald Forest Loop",
          location: "Boulder, CO",
          coordinates: [-105.2839, 40.0202] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
          difficulty: "moderate",
          length: 3.2,
          elevation: 450,
          elevationGain: 450,
          elevationLoss: 450,
          duration: "2h 15m",
          tags: ["scenic", "forest", "dog-friendly"],
          likes: 241,
          description: "The Emerald Forest Loop is a spectacular 3.2 mile heavily trafficked loop trail that features beautiful wildflowers and is rated as moderate. The trail offers a number of activity options and is best used from April until October. Dogs are also able to use this trail but must be kept on leash.",
        },
        // Add more trails here
      ];
      
      return mockTrails.find(trail => trail.id === trailId) || null;
    },
    enabled: !!trailId,
  });
};
