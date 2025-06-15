import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
}

export function useNotificationPopover() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { speak } = useTextToSpeech();

  // Real-time subscription (for popover, but can be reused)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          const notification = payload.new as Notification;
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
          speak(`${notification.title}. ${notification.message}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast, speak]);

  // Also allow external setter for open
  const handleOpenChange = useCallback((next: boolean) => setOpen(next), []);

  return { open, setOpen: handleOpenChange };
}

// Storage bucket reminder (manual step): 
// Make sure to create buckets "avatars", "stories-media", "album-media" in Supabase Storage UI. 
// Set read permissions per app needs.
