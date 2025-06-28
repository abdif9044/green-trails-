
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';

// Events/hikes hooks
export const useHikingEvents = () => {
  return useQuery({
    queryKey: ['hiking-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hiking_events')
        .select(`
          *,
          organizer:organizer_id(id, username, full_name, avatar_url),
          attendees:event_attendees(
            user_id,
            status,
            user:user_id(id, username, full_name, avatar_url)
          )
        `)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useRSVPEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      status 
    }: { 
      eventId: string; 
      status: 'going' | 'maybe' | 'declined' 
    }) => {
      if (!user) throw new Error('Must be logged in to RSVP');
      const { error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
          rsvp_at: new Date().toISOString()
        }, {
          onConflict: 'event_id,user_id'
        });
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['hiking-events'] });
      toast({
        title: "RSVP Updated",
        description: `You're now marked as "${status}" for this hike.`,
      });
    },
  });
};
