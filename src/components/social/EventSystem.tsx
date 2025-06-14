
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Clock, Plus, Check, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow, format } from 'date-fns';

interface HikingEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  trail_name: string;
  date: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  max_participants: number;
  current_participants: number;
  organizer: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  attendees: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    status: 'going' | 'maybe' | 'declined';
  }>;
  requirements: string[];
  meeting_point: string;
  is_private: boolean;
  created_at: string;
}

const EventSystem: React.FC = () => {
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HikingEvent | null>(null);

  // Mock events data
  const mockEvents: HikingEvent[] = [
    {
      id: '1',
      title: 'Sunrise Hike at Mount Tamalpais',
      description: 'Join us for an early morning hike to catch the sunrise from the peak. Bring headlamps and warm layers!',
      location: 'Mill Valley, CA',
      trail_name: 'Mount Tamalpais East Peak Trail',
      date: '2024-02-20T05:30:00Z',
      duration: '4 hours',
      difficulty: 'moderate',
      max_participants: 12,
      current_participants: 8,
      organizer: {
        id: 'org1',
        name: 'Sarah Chen',
        avatar_url: undefined
      },
      attendees: [
        { id: 'att1', name: 'Mike Johnson', avatar_url: undefined, status: 'going' },
        { id: 'att2', name: 'Lisa Park', avatar_url: undefined, status: 'going' },
        { id: 'att3', name: 'Tom Wilson', avatar_url: undefined, status: 'maybe' },
      ],
      requirements: ['Headlamp', 'Warm layers', 'Water (2L)', 'Snacks'],
      meeting_point: 'Mountain Home Inn Parking Lot',
      is_private: false,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Weekend Photography Hike',
      description: 'Explore beautiful wildflower meadows while learning photography techniques from local experts.',
      location: 'Point Reyes, CA',
      trail_name: 'Tomales Point Trail',
      date: '2024-02-24T09:00:00Z',
      duration: '6 hours',
      difficulty: 'easy',
      max_participants: 15,
      current_participants: 12,
      organizer: {
        id: 'org2',
        name: 'David Rodriguez',
        avatar_url: undefined
      },
      attendees: [],
      requirements: ['Camera', 'Tripod (optional)', 'Lunch', 'Sunscreen'],
      meeting_point: 'Point Reyes Visitor Center',
      is_private: false,
      created_at: new Date().toISOString()
    }
  ];

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
      case 'going': return 'text-green-600';
      case 'maybe': return 'text-yellow-600';
      case 'declined': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <Calendar className="h-5 w-5 text-luxury-900" />
            </div>
            <div>
              <h2 className="text-xl luxury-heading text-white">Upcoming Hikes</h2>
              <p className="text-sm luxury-text text-luxury-400">Join organized group hikes in your area</p>
            </div>
          </div>
          
          {user && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gold-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Plan Hike
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Plan New Group Hike</DialogTitle>
                </DialogHeader>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Event planning form coming soon...</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <Card key={event.id} className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 hover:border-gold-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Event Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl luxury-heading text-white mb-2">{event.title}</h3>
                      <p className="text-luxury-300 luxury-text leading-relaxed">{event.description}</p>
                    </div>
                    <Badge className={`luxury-text ${getDifficultyColor(event.difficulty)}`}>
                      {event.difficulty}
                    </Badge>
                  </div>
                  
                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-luxury-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-luxury-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(new Date(event.date), 'h:mm a')} • {event.duration}
                    </div>
                    <div className="flex items-center text-luxury-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.trail_name}
                    </div>
                    <div className="flex items-center text-luxury-400">
                      <Users className="h-4 w-4 mr-2" />
                      {event.current_participants}/{event.max_participants} joined
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.organizer.avatar_url} />
                      <AvatarFallback className="bg-greentrail-gradient text-white text-sm">
                        {event.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">Organized by {event.organizer.name}</p>
                      <p className="text-xs text-luxury-400">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendees & Actions */}
                <div className="lg:w-80 space-y-4">
                  {/* Attendees Preview */}
                  <div>
                    <p className="text-sm font-medium text-white mb-3">Attendees ({event.current_participants})</p>
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 5).map((attendee) => (
                        <Avatar key={attendee.id} className="h-8 w-8 border-2 border-luxury-900">
                          <AvatarImage src={attendee.avatar_url} />
                          <AvatarFallback className="bg-greentrail-gradient text-white text-xs">
                            {attendee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {event.current_participants > 5 && (
                        <div className="h-8 w-8 rounded-full bg-luxury-700 border-2 border-luxury-900 flex items-center justify-center">
                          <span className="text-xs text-white">+{event.current_participants - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RSVP Actions */}
                  {user && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white mb-2">Will you join?</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-500/30" variant="outline">
                          <Check className="h-3 w-3 mr-1" />
                          Going
                        </Button>
                        <Button size="sm" className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border-yellow-500/30" variant="outline">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maybe
                        </Button>
                        <Button size="sm" className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/30" variant="outline">
                          <X className="h-3 w-3 mr-1" />
                          Can't go
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* View Details */}
                  <Button 
                    className="w-full gold-button"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-muted-foreground">{selectedEvent.description}</p>
                
                {/* Requirements */}
                <div>
                  <h4 className="font-semibold mb-2">What to Bring</h4>
                  <ul className="space-y-1">
                    {selectedEvent.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-greentrail-500 rounded-full mr-2"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meeting Point */}
                <div>
                  <h4 className="font-semibold mb-2">Meeting Point</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.meeting_point}</p>
                </div>

                {/* All Attendees */}
                <div>
                  <h4 className="font-semibold mb-3">All Attendees ({selectedEvent.current_participants})</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvent.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={attendee.avatar_url} />
                          <AvatarFallback className="text-xs">{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{attendee.name}</span>
                        <span className={`text-xs ${getStatusColor(attendee.status)}`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventSystem;
