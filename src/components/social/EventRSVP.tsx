
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EventRSVPProps {
  event: any;
}

const RSVP_OPTIONS = [
  {
    value: 'attending',
    label: 'Going',
    icon: Check,
    className: "bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-500/30"
  },
  {
    value: 'maybe',
    label: 'Maybe',
    icon: AlertTriangle,
    className: "bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border-yellow-500/30"
  },
  {
    value: 'not_attending',
    label: "Can't go",
    icon: X,
    className: "bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/30"
  }
];

const EventRSVP: React.FC<EventRSVPProps> = ({ event }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        }, {
          onConflict: 'event_id,user_id'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiking-events'] });
      toast({
        title: "RSVP Updated",
        description: "Your attendance status has been updated.",
      });
    },
    onError: (error) => {
      console.error('RSVP error:', error);
      toast({
        title: "Error",
        description: "Failed to update your RSVP status.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return null;
  }

  const userRSVP = event.attendees?.find((a: any) => a.user_id === user.id)?.status;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white mb-2">Will you join?</p>
      <div className="grid grid-cols-3 gap-2">
        {RSVP_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            size="sm"
            className={opt.className + (userRSVP === opt.value ? " ring-2 ring-gold-400" : "")}
            variant="outline"
            onClick={() => rsvpMutation.mutate({
              eventId: event.id,
              status: opt.value
            })}
            disabled={rsvpMutation.isPending}
          >
            <opt.icon className="h-3 w-3 mr-1" />
            {opt.label}
          </Button>
        ))}
      </div>
      {userRSVP && (
        <p className="text-xs text-white mt-2">
          Your RSVP status: <b>{userRSVP}</b>
        </p>
      )}
    </div>
  );
};

export default EventRSVP;
