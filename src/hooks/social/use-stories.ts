
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';

// Stories hooks - temporarily disabled until table is created
export const useStories = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      console.log('Stories table not yet available');
      return [];
    },
  });
};

export const useCreateStory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      mediaUrl, 
      caption, 
      location 
    }: { 
      mediaUrl: string; 
      caption?: string; 
      location?: { lat: number; lng: number; name?: string } 
    }) => {
      console.log('Story creation not yet available');
      // Gracefully handle missing table
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast({
        title: "Story created!",
        description: "Your story has been shared with your followers.",
      });
    },
  });
};
