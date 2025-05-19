
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/types/badges';
import { availableBadges } from '@/data/available-badges';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useBadgeUnlockToast } from '@/components/badges/BadgeUnlockToast';

export const useBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([...availableBadges]);
  const [loading, setLoading] = useState(true);
  const { showBadgeUnlockToast } = useBadgeUnlockToast();

  // Function to load badge progress from database
  const loadBadges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch badge progress from Supabase
      const { data, error } = await supabase
        .from('badge_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Map the progress data to our badges
      const updatedBadges = availableBadges.map(badge => {
        const userProgress = data?.find(p => p.badge_id === badge.id);
        
        if (userProgress) {
          return {
            ...badge,
            progress: userProgress.progress,
            unlocked: userProgress.unlocked,
            unlockedAt: userProgress.unlocked_at ? new Date(userProgress.unlocked_at) : undefined
          };
        }
        return badge;
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
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('badge_progress')
        .upsert(
          {
            user_id: user.id,
            badge_id: badgeId,
            progress,
            unlocked: shouldUnlock,
            unlocked_at: shouldUnlock ? new Date().toISOString() : undefined
          },
          { onConflict: 'user_id,badge_id' }
        );

      if (error) throw error;

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
