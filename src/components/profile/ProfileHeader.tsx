
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRoundCheck } from 'lucide-react';
import { useIsFollowing, useToggleFollow, useFollowCounts } from '@/hooks/use-social-follows';
import { Profile } from '@/hooks/use-profile';
import { useAuth } from '@/hooks/use-auth';

interface ProfileHeaderProps {
  profile: Profile | null;
  isLoading: boolean;
  isCurrentUser: boolean;
  onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isLoading, 
  isCurrentUser,
  onEditProfile 
}) => {
  const { user } = useAuth();
  const { mutate: toggleFollow, isPending: isFollowActionPending } = useToggleFollow();
  const { data: isFollowing, isLoading: isFollowCheckLoading } = useIsFollowing(profile?.id || '');
  const { followersCount, followingCount, isLoading: isCountLoading } = useFollowCounts(profile?.id || '');
  
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <Skeleton className="h-7 w-40 mx-auto md:mx-0" />
            <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex justify-center md:justify-start space-x-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">User not found</h3>
        <p className="text-muted-foreground mt-2">
          The profile you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <Avatar className="h-24 w-24 border-2 border-greentrail-100 shadow-md">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
        <AvatarFallback>
          {profile.username?.substring(0, 2).toUpperCase() || 'GT'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            {profile.is_age_verified && (
              <Badge className="bg-greentrail-600 hover:bg-greentrail-700 gap-1">
                <UserRoundCheck className="h-3 w-3" />
                <span>Age Verified</span>
              </Badge>
            )}
          </div>
          {profile.full_name && (
            <p className="text-muted-foreground">{profile.full_name}</p>
          )}
        </div>
        
        {profile.bio && (
          <p className="text-sm">{profile.bio}</p>
        )}
        
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
          <div>
            <span className="font-semibold">{isCountLoading ? '...' : followersCount}</span>
            {' '}
            <span className="text-muted-foreground">followers</span>
          </div>
          <div>
            <span className="font-semibold">{isCountLoading ? '...' : followingCount}</span>
            {' '}
            <span className="text-muted-foreground">following</span>
          </div>
        </div>
        
        <div className="pt-2">
          {isCurrentUser ? (
            <Button onClick={onEditProfile} variant="outline">
              Edit Profile
            </Button>
          ) : user && (
            <Button
              onClick={() => toggleFollow(profile.id)}
              disabled={isFollowActionPending || isFollowCheckLoading}
              variant={isFollowing ? "outline" : "default"}
            >
              {isFollowActionPending ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
