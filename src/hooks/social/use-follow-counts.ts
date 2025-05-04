
import { useQuery } from '@tanstack/react-query';
import { useFollowersCount } from './use-followers';
import { useFollowingCount } from './use-following';

// Hook to get follower and following counts
export const useFollowCounts = (userId: string) => {
  const { data: followersCount = 0, isLoading: isFollowersLoading } = useFollowersCount(userId);
  const { data: followingCount = 0, isLoading: isFollowingLoading } = useFollowingCount(userId);
  
  return {
    followersCount,
    followingCount,
    isLoading: isFollowersLoading || isFollowingLoading,
    isError: false
  };
};
