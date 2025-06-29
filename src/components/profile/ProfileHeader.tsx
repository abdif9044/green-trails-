
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToggleFollow, useIsFollowing } from '@/hooks/social/use-follow-actions';

interface ProfileHeaderProps {
  userId?: string;
  username?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  followersCount?: number;
  followingCount?: number;
  trailsCompleted?: number;
  badges?: Array<{ id: string; name: string; icon: string }>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  username = 'trail_explorer',
  fullName = 'Trail Explorer',
  bio = 'Passionate hiker exploring nature one trail at a time 🥾🏔️',
  location = 'Pacific Northwest',
  joinDate = 'January 2024',
  followersCount = 1247,
  followingCount = 389,
  trailsCompleted = 127,
  badges = []
}) => {
  const { user } = useAuth();
  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(userId || '');
  const toggleFollow = useToggleFollow();

  const isOwnProfile = user?.id === userId;

  const handleFollowToggle = () => {
    if (!userId) return;
    
    toggleFollow.mutate({ 
      targetUserId: userId, 
      isFollowing: isFollowing || false 
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="text-2xl bg-greentrail-100 text-greentrail-800">
                {fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {!isOwnProfile && userId && (
              <Button
                onClick={handleFollowToggle}
                disabled={isFollowingLoading || toggleFollow.isPending}
                variant={isFollowing ? "outline" : "default"}
                className="w-full md:w-auto"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="text-center md:text-left mb-4">
              <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                {fullName}
              </h1>
              <p className="text-greentrail-600 dark:text-greentrail-400">
                @{username}
              </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 text-center md:text-left">
              {bio}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 justify-center md:justify-start">
              <div className="text-center">
                <div className="font-semibold text-greentrail-800 dark:text-greentrail-200">
                  {followersCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-greentrail-800 dark:text-greentrail-200">
                  {followingCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Following
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-greentrail-800 dark:text-greentrail-200">
                  {trailsCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Trails
                </div>
              </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {badges.slice(0, 5).map((badge) => (
                  <Badge
                    key={badge.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-greentrail-100 text-greentrail-800"
                  >
                    <Trophy className="h-3 w-3" />
                    {badge.name}
                  </Badge>
                ))}
                {badges.length > 5 && (
                  <Badge variant="outline" className="text-greentrail-600">
                    +{badges.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
