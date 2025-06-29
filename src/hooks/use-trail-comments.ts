
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrailComment } from '@/types/trails';

export const useTrailComments = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-comments', trailId],
    queryFn: async (): Promise<TrailComment[]> => {
      // For now return mock data since we don't have a comments table yet
      return [
        {
          id: '1',
          user_id: 'user1',
          trail_id: trailId,
          content: 'Great trail with amazing views!',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user2',
          trail_id: trailId,
          content: 'Challenging but worth it.',
          created_at: new Date().toISOString(),
        }
      ];
    },
    enabled: !!trailId,
  });
};

export const useAddTrailComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ trailId, content }: { trailId: string; content: string }) => {
      // Mock implementation - would normally insert into database
      return {
        id: Date.now().toString(),
        trail_id: trailId,
        content,
        user_id: 'current-user',
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: (_, { trailId }) => {
      queryClient.invalidateQueries({ queryKey: ['trail-comments', trailId] });
    },
  });
};
