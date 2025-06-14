
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Users, MapPin, Trophy, Check, Bell } from "lucide-react";
import type { Notification } from "@/hooks/social/use-notification-popover";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "follow":
      return <Users className="h-4 w-4 text-green-500" />;
    case "mention":
      return <MessageCircle className="h-4 w-4 text-purple-500" />;
    case "group_invite":
      return <Users className="h-4 w-4 text-gold-500" />;
    case "event":
      return <MapPin className="h-4 w-4 text-greentrail-500" />;
    case "achievement":
      return <Trophy className="h-4 w-4 text-gold-500" />;
    case "trail_update":
      return <MapPin className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

interface Props {
  notification: Notification;
  onRead: (notificationId: string) => void;
}

const NotificationItem: React.FC<Props> = ({ notification, onRead }) => {
  return (
    <div
      className={`p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 ${!notification.read ? 'bg-muted/20' : ''}`}
      onClick={() => {
        if (!notification.read) {
          onRead(notification.id);
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
