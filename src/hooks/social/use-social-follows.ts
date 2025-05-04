
import { useFollowersList } from './use-followers';
import { useFollowingList } from './use-following';

// Type definitions for profile data
interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

// The combined hook for social follows
export const useSocialFollows = (userId?: string) => {
  const { data: followers = [], isLoading: isFollowersLoading } = useFollowersList(userId || '');
  const { data: following = [], isLoading: isFollowingLoading } = useFollowingList(userId || '');

  // Transform data to a more usable format
  const followingUsers = following.map(f => ({
    id: f.following_id,
    username: f.profiles?.username || '',
    full_name: f.profiles?.full_name || '',
    avatar_url: f.profiles?.avatar_url || ''
  }));
  
  const followerUsers = followers.map(f => ({
    id: f.follower_id,
    username: f.profiles?.username || '',
    full_name: f.profiles?.full_name || '',
    avatar_url: f.profiles?.avatar_url || ''
  }));

  return {
    followingUsers,
    followerUsers,
    isLoading: isFollowersLoading || isFollowingLoading
  };
};
