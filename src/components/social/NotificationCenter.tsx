
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationPopover } from "@/hooks/social/use-notification-popover";
import NotificationPopover from "./NotificationPopover";
import NotificationList from "./NotificationList";

// Interface reused from use-notification-popover
interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const { open, setOpen } = useNotificationPopover();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <NotificationPopover open={open} setOpen={setOpen} unreadCount={unreadCount}>
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        unreadCount={unreadCount}
        onItemRead={notificationId => markAsReadMutation.mutate(notificationId)}
      />
    </NotificationPopover>
  );
};

export default NotificationCenter;
