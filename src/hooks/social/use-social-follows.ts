
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
  
  // Fetch following users
  useEffect(() => {
    const fetchFollowing = async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!following_id(id, username, full_name, avatar_url)
        `)
        .eq('follower_id', userId);

      if (!error && data) {
        setFollowing(data.map(item => ({
          id: item.profiles?.id || '',
          username: item.profiles?.username || '',
          full_name: item.profiles?.full_name || '',
          avatar_url: item.profiles?.avatar_url || ''
        })));
      }
    };
    
    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  // Fetch followers
  useEffect(() => {
    const fetchFollowers = async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follower_id(id, username, full_name, avatar_url)
        `)
        .eq('following_id', userId);

      if (!error && data) {
        setFollowers(data.map(item => ({
          id: item.profiles?.id || '',
          username: item.profiles?.username || '',
          full_name: item.profiles?.full_name || '',
          avatar_url: item.profiles?.avatar_url || ''
        })));
      }
    };
    
    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  return {
    following,
    followers
  };
};
