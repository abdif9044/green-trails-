
import React, { useState } from "react";
import { useHikingEvents } from "@/hooks/social/use-hiking-events";
import EventCard from "./EventCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const EventList: React.FC = () => {
  const { data: events = [], isLoading, isError } = useHikingEvents();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

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
