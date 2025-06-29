
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EventCard from "./EventCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HikingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  trail_id: string;
  organizer_id: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
  organizer?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  attendees?: Array<{
    user_id: string;
    status: string;
    user: {
      id: string;
      username: string;
      full_name: string;
      avatar_url: string;
    };
  }>;
}

const useHikingEvents = () => {
  return useQuery({
    queryKey: ['hiking-events'],
    queryFn: async (): Promise<HikingEvent[]> => {
      const { data, error } = await supabase
        .from('hiking_events')
        .select(`
          *,
          organizer:profiles!hiking_events_organizer_id_fkey(id, username, full_name, avatar_url),
          attendees:event_attendees(
            user_id,
            status,
            user:profiles!event_attendees_user_id_fkey(id, username, full_name, avatar_url)
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching hiking events:', error);
        return [];
      }

      return data || [];
    },
  });
};

const EventList: React.FC = () => {
  const { data: events = [], isLoading, isError } = useHikingEvents();
  const [selectedEvent, setSelectedEvent] = useState<HikingEvent | null>(null);

  if (isLoading) {
    return (
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-8 rounded-xl text-center">
        Loading events...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-8 rounded-xl text-center text-red-400">
        Failed to load events.
      </div>
    );
  }
  if (!events.length) {
    return (
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-8 rounded-xl text-center text-luxury-300">
        No group hikes scheduled. Check back soon!
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onViewDetails={setSelectedEvent} />
        ))}
      </div>
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <EventCard event={selectedEvent} expanded onViewDetails={() => setSelectedEvent(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventList;
