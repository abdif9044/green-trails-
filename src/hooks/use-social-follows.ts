
import { useFollowersList, useFollowingList } from './use-social-follows';

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
