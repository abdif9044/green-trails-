
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
      // First get the events
      const { data: events, error: eventsError } = await supabase
        .from('hiking_events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching hiking events:', eventsError);
        return [];
      }

      if (!events || events.length === 0) {
        return [];
      }

      // Get organizer profiles separately
      const organizerIds = [...new Set(events.map(event => event.organizer_id))];
      const { data: organizers } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', organizerIds);

      // Get attendees separately
      const eventIds = events.map(event => event.id);
      const { data: attendees } = await supabase
        .from('event_attendees')
        .select(`
          user_id,
          status,
          event_id,
          profiles!event_attendees_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .in('event_id', eventIds);

      // Combine the data
      const enrichedEvents: HikingEvent[] = events.map(event => ({
        ...event,
        organizer: organizers?.find(org => org.id === event.organizer_id) || {
          id: event.organizer_id,
          username: 'Unknown',
          full_name: 'Unknown User',
          avatar_url: ''
        },
        attendees: attendees?.filter(att => att.event_id === event.id).map(att => ({
          user_id: att.user_id,
          status: att.status,
          user: (att.profiles as any) || {
            id: att.user_id,
            username: 'Unknown',
            full_name: 'Unknown User',
            avatar_url: ''
          }
        })) || []
      }));

      return enrichedEvents;
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
