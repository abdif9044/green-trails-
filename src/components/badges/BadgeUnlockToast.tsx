
import React from 'react';
import { Badge } from '@/types/badges';
import { BadgeIcon } from './BadgeIcon';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { confetti } from '@/utils/confetti';

export const useBadgeUnlockToast = () => {
  const { toast } = useToast();

  const showBadgeUnlockToast = (badge: Badge) => {
    // Trigger confetti effect
    confetti();
    
    toast({
      title: `🎉 New Badge Unlocked!`,
      description: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-greentrail-100 dark:bg-greentrail-900/50 flex items-center justify-center">
            <BadgeIcon icon={badge.icon} size={20} />
          </div>
          <div>
            <div className="font-medium">{badge.name}</div>
            <div className="text-sm text-muted-foreground">{badge.description}</div>
          </div>
        </div>
      ),
      action: (
        <ToastAction altText="View">View</ToastAction>
      ),
      duration: 6000,
    });
  };

  return { showBadgeUnlockToast };
};
