
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { WeatherData } from '@/features/weather/types/weather-types';

export const useTrailComments = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-comments', trailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trail_comments')
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('trail_id', trailId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useTrailLikes = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-likes', trailId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('trail_likes')
        .select('*', { count: 'exact', head: true })
        .eq('trail_id', trailId);

      if (error) throw error;
      return count || 0;
    },
  });
};

export const useTrailWeather = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-weather', trailId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('trail_weather')
          .select('*')
          .eq('trail_id', trailId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          return {
            temperature: data.temperature,
            condition: data.condition,
            high: data.high,
            low: data.low,
            precipitation: data.precipitation,
            sunrise: data.sunrise,
            sunset: data.sunset,
            windSpeed: data.wind_speed || '',
            windDirection: data.wind_direction || ''
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error fetching trail weather:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 60,        // 1 hour
    gcTime: 1000 * 60 * 60 * 24,      // 24 hours
  });
};

export const useAddComment = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Must be logged in to comment');

      const { error } = await supabase
        .from('trail_comments')
        .insert([
          {
            trail_id: trailId,
            user_id: user.id,
            content,
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-comments', trailId] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useToggleLike = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in to like trails');

      const { data: existingLike } = await supabase
        .from('trail_likes')
        .select('id')
        .eq('trail_id', trailId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('trail_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        await supabase
          .from('trail_likes')
          .insert([
            {
              trail_id: trailId,
              user_id: user.id,
            },
          ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-likes', trailId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
