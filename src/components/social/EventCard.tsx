
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import EventRSVP from "./EventRSVP";
import { formatDistanceToNow, format } from "date-fns";

type AttendeeType = {
  user_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  }
};

interface EventCardProps {
  event: any;
  expanded?: boolean;
  onViewDetails?: (event: any) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'moderate': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'hard': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'expert': return 'bg-red-500/20 text-red-600 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'attending': return 'text-green-600';
    case 'maybe': return 'text-yellow-600';
    case 'not_attending': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const EventCard: React.FC<EventCardProps> = ({ event, expanded, onViewDetails }) => {
  const organizer = event.organizer || {};
  const attendees: AttendeeType[] = Array.isArray(event.attendees)
    ? event.attendees.map((att) => ({
        ...att,
        user: att.user || {},
      }))
    : [];

  // In expanded mode, show all details and attendees
  if (expanded) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{event.title}</h2>
        <p className="text-muted-foreground">{event.description}</p>
        <div>
          <h4 className="font-semibold mb-2">Event Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {event.date ? format(new Date(event.date), 'MMM dd, yyyy') : "TBD"}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {event.date ? format(new Date(event.date), 'h:mm a') : "TBD"}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location || "Location TBD"}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {attendees.filter(a => a.status === "attending").length || 0}
              {event.max_participants ? `/${event.max_participants}` : ''} joined
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">All Attendees ({attendees.length})</h4>
          <div className="grid grid-cols-2 gap-2">
            {attendees.map((att) => (
              <div key={att.user_id} className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={att.user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {att.user.full_name?.charAt(0) ?? att.user.username?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{att.user.full_name || att.user.username}</span>
                <span className={`text-xs ${getStatusColor(att.status)}`}>{att.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact display for the event list
  return (
    <Card className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 hover:border-gold-500/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Event Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl luxury-heading text-white mb-2">{event.title}</h3>
                <p className="text-luxury-300 luxury-text leading-relaxed">{event.description}</p>
              </div>
            </div>
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-luxury-400">
                <Calendar className="h-4 w-4 mr-2" />
                {event.date ? format(new Date(event.date), 'MMM dd, yyyy') : "TBD"}
              </div>
              <div className="flex items-center text-luxury-400">
                <Clock className="h-4 w-4 mr-2" />
                {event.date ? format(new Date(event.date), 'h:mm a') : "TBD"}
              </div>
              <div className="flex items-center text-luxury-400">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location || "Location TBD"}
              </div>
              <div className="flex items-center text-luxury-400">
                <Users className="h-4 w-4 mr-2" />
                {attendees.filter(a => a.status === "attending").length || 0}
                {event.max_participants ? `/${event.max_participants}` : ''} joined
              </div>
            </div>
            {/* Organizer */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={organizer.avatar_url} />
                <AvatarFallback className="bg-greentrail-gradient text-white text-sm">
                  {organizer.full_name?.charAt(0) ?? organizer.username?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">
                  Organized by {organizer.full_name || organizer.username || 'Unknown'}
                </p>
                <p className="text-xs text-luxury-400">
                  {event.created_at && formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          {/* Actions area */}
          <div className="lg:w-80 space-y-4">
            {/* Attendees Preview */}
            <div>
              <p className="text-sm font-medium text-white mb-3">
                Attendees ({attendees.filter(a => a.status === "attending").length})
              </p>
              <div className="flex -space-x-2">
                {attendees
                  .filter(a => a.status === "attending")
                  .slice(0, 5)
                  .map(att => (
                  <Avatar key={att.user_id} className="h-8 w-8 border-2 border-luxury-900">
                    <AvatarImage src={att.user.avatar_url} />
                    <AvatarFallback className="bg-greentrail-gradient text-white text-xs">
                      {att.user.full_name?.charAt(0) ?? att.user.username?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {attendees.filter(a => a.status === "attending").length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-luxury-700 border-2 border-luxury-900 flex items-center justify-center">
                    <span className="text-xs text-white">
                      +{attendees.filter(a => a.status === "attending").length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* RSVP Actions */}
            <EventRSVP event={event} />
            {/* View Details */}
            {onViewDetails && (
              <button className="w-full gold-button" onClick={() => onViewDetails(event)}>
                View Details
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
