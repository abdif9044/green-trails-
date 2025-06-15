
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';

// Story type derived from the stories table
export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  location_name?: string;
  expires_at: string;
  created_at: string;
}

export const useStories = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Story[];
    },
  });
};

export const useCreateStory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      media_url,
      caption,
      location_name
    }: {
      media_url: string;
      caption?: string;
      location_name?: string;
    }) => {
      if (!user) throw new Error('You must be logged in to create a story');
      const expires_at = new Date(Date.now() + 1000*60*60*24).toISOString(); // 24h from now
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url,
          caption,
          location_name,
          expires_at,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Story posted!" });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
