
import { useState } from 'react';

export const useNotificationPopover = () => {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
  };
};

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}
