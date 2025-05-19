
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/types/badges';
import { availableBadges } from '@/data/available-badges';
import { useAuth } from '@/hooks/use-auth';
import { useBadgeUnlockToast } from '@/components/badges/BadgeUnlockToast';

export const useBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([...availableBadges]);
  const [loading, setLoading] = useState(true);
  const { showBadgeUnlockToast } = useBadgeUnlockToast();

  // Function to load badge progress
  const loadBadges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // TODO: In future, fetch badge progress from Supabase
      // For now, we'll simulate some random progress
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate some random badge progress
      const updatedBadges = availableBadges.map(badge => {
        // Randomly unlock some badges for demo purposes
        const randomUnlock = Math.random() > 0.7;
        const randomProgress = Math.floor(Math.random() * (badge.maxProgress || 1));
        
        return {
          ...badge,
          progress: randomProgress,
          unlocked: randomUnlock || (badge.maxProgress ? randomProgress >= badge.maxProgress : false),
          unlockedAt: randomUnlock ? new Date() : undefined
        };
      });

      setBadges(updatedBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to update badge progress
  const updateBadgeProgress = useCallback(async (
    badgeId: string, 
    progress: number,
  ) => {
    if (!user) return null;

    try {
      const badgeToUpdate = badges.find(b => b.id === badgeId);
      if (!badgeToUpdate) return null;

      const maxProgress = badgeToUpdate.maxProgress || 0;
      const shouldUnlock = progress >= maxProgress && !badgeToUpdate.unlocked;
      
      // Update local state
      setBadges(prev => 
        prev.map(badge => 
          badge.id === badgeId 
            ? { 
                ...badge, 
                progress, 
                unlocked: shouldUnlock || badge.unlocked,
                unlockedAt: shouldUnlock ? new Date() : badge.unlockedAt
              }
            : badge
        )
      );

      // Show toast if badge was just unlocked
      if (shouldUnlock) {
        const unlockedBadge = badges.find(b => b.id === badgeId);
        if (unlockedBadge) {
          showBadgeUnlockToast(unlockedBadge);
        }
      }

      return shouldUnlock;
    } catch (error) {
      console.error('Error updating badge progress:', error);
      return null;
    }
  }, [badges, user, showBadgeUnlockToast]);

  // Load badges on mount and when user changes
  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  return {
    badges,
    loading,
    updateBadgeProgress,
    loadBadges
  };
};
