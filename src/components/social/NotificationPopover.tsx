
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, BellDot } from "lucide-react";

interface NotificationPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  unreadCount: number;
  children: React.ReactNode;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  open, setOpen, unreadCount, children,
}) => (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" className="relative">
        {unreadCount > 0 ? (
          <BellDot className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80 p-0" align="end">
      {children}
    </PopoverContent>
  </Popover>
);
