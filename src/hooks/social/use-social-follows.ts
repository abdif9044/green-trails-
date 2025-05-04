
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

// Type for following/follower user data
export interface SocialUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

// Primary hook for accessing social follows data
export const useSocialFollows = (userId: string) => {
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch following users
  useEffect(() => {
    const fetchFollowing = async () => {
      setIsLoading(true);
      
      if (!userId) {
        setFollowing([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('follows')
          .select(`
            following_id,
            profiles!following_id(id, username, full_name, avatar_url)
          `)
          .eq('follower_id', userId);

        if (error) {
          console.error("Error fetching following:", error);
          setFollowing([]);
        } else if (data) {
          const followingUsers = data
            .filter(item => item.profiles !== null) // Filter out null profiles
            .map(item => {
              // Safely access profile properties with fallback values
              const profile = item.profiles || {};
              return {
                id: profile.id || '',
                username: profile.username || '',
                full_name: profile.full_name || '',
                avatar_url: profile.avatar_url || ''
              };
            })
            .filter(item => item.id !== '');
          
          setFollowing(followingUsers);
        }
      } catch (err) {
        console.error("Exception in fetchFollowing:", err);
        setFollowing([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFollowing();
  }, [userId]);

  // Fetch followers
  useEffect(() => {
    const fetchFollowers = async () => {
      setIsLoading(true);
      
      if (!userId) {
        setFollowers([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('follows')
          .select(`
            follower_id,
            profiles!follower_id(id, username, full_name, avatar_url)
          `)
          .eq('following_id', userId);

        if (error) {
          console.error("Error fetching followers:", error);
          setFollowers([]);
        } else if (data) {
          const followerUsers = data
            .filter(item => item.profiles !== null) // Filter out null profiles
            .map(item => {
              // Safely access profile properties with fallback values
              const profile = item.profiles || {};
              return {
                id: profile.id || '',
                username: profile.username || '',
                full_name: profile.full_name || '',
                avatar_url: profile.avatar_url || ''
              };
            })
            .filter(item => item.id !== '');
          
          setFollowers(followerUsers);
        }
      } catch (err) {
        console.error("Exception in fetchFollowers:", err);
        setFollowers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFollowers();
  }, [userId]);

  return {
    following,
    followers,
    isLoading
  };
};
