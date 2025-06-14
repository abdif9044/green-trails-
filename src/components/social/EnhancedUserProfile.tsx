
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, MapPin, Calendar, Award, Mountain, Timer, Compass, 
  Camera, Heart, MessageCircle, Users, Star, TrendingUp,
  Globe, Instagram, Twitter, Mail, Edit, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';

interface HikingStats {
  total_hikes: number;
  total_distance: number;
  total_elevation: number;
  total_time: number;
  favorite_difficulty: string;
  longest_hike: number;
  highest_elevation: number;
  current_streak: number;
  best_streak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
}

interface EnhancedProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  location: string;
  website_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  avatar_url?: string;
  cover_image_url?: string;
  is_verified: boolean;
  is_guide: boolean;
  member_since: string;
  hiking_stats: HikingStats;
  achievements: Achievement[];
  social_stats: {
    followers: number;
    following: number;
    posts: number;
    likes_received: number;
  };
}

const EnhancedUserProfile: React.FC<{ userId?: string }> = ({ userId }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock enhanced profile data
  const mockProfile: EnhancedProfile = {
    id: userId || user?.id || '1',
    username: 'sarah_hiker',
    full_name: 'Sarah Chen',
    bio: 'Passionate hiker and nature photographer exploring the beautiful trails of Northern California. Always seeking new adventures and sharing the journey! 🏔️📸',
    location: 'San Francisco, CA',
    website_url: 'https://sarahshikes.com',
    instagram_url: 'https://instagram.com/sarah_hiker',
    twitter_url: 'https://twitter.com/sarah_hiker',
    avatar_url: undefined,
    cover_image_url: undefined,
    is_verified: true,
    is_guide: false,
    member_since: '2023-01-15T00:00:00Z',
    hiking_stats: {
      total_hikes: 127,
      total_distance: 892.5,
      total_elevation: 156000,
      total_time: 384,
      favorite_difficulty: 'Moderate',
      longest_hike: 28.4,
      highest_elevation: 14500,
      current_streak: 12,
      best_streak: 28
    },
    achievements: [
      {
        id: '1',
        name: 'First Summit',
        description: 'Complete your first mountain peak',
        icon: '🏔️',
        unlocked: true,
        unlocked_at: '2023-02-10T00:00:00Z'
      },
      {
        id: '2',
        name: 'Century Club',
        description: 'Complete 100 hikes',
        icon: '💯',
        unlocked: true,
        unlocked_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Marathon Hiker',
        description: 'Hike 26.2 miles in a single day',
        icon: '🏃‍♀️',
        unlocked: false,
        progress: 18.7,
        max_progress: 26.2
      },
      {
        id: '4',
        name: 'Social Butterfly',
        description: 'Join 10 group hikes',
        icon: '🦋',
        unlocked: true,
        unlocked_at: '2023-11-20T00:00:00Z'
      }
    ],
    social_stats: {
      followers: 1247,
      following: 389,
      posts: 89,
      likes_received: 3420
    }
  };

  const isOwnProfile = !userId || userId === user?.id;

  return (
    <div className="space-y-6">
      {/* Cover Photo & Avatar */}
      <div className="relative h-48 lg:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-greentrail-600 to-greentrail-800">
        {mockProfile.cover_image_url ? (
          <img 
            src={mockProfile.cover_image_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full luxury-pattern opacity-20"></div>
        )}
        
        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={mockProfile.avatar_url} />
            <AvatarFallback className="bg-greentrail-gradient text-white text-2xl font-bold">
              {mockProfile.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Edit Button */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl mt-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl luxury-heading text-white">{mockProfile.full_name}</h1>
                {mockProfile.is_verified && (
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {mockProfile.is_guide && (
                  <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                    <Compass className="h-3 w-3 mr-1" />
                    Guide
                  </Badge>
                )}
              </div>
              <p className="text-luxury-400 luxury-text">@{mockProfile.username}</p>
              <p className="text-luxury-300 luxury-text mt-2 leading-relaxed max-w-2xl">
                {mockProfile.bio}
              </p>
            </div>
            
            {/* Location & Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-luxury-400">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {mockProfile.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {formatDistanceToNow(new Date(mockProfile.member_since), { addSuffix: true })}
              </div>
              {mockProfile.website_url && (
                <a href={mockProfile.website_url} className="flex items-center hover:text-white transition-colors">
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </a>
              )}
              {mockProfile.instagram_url && (
                <a href={mockProfile.instagram_url} className="flex items-center hover:text-white transition-colors">
                  <Instagram className="h-4 w-4 mr-1" />
                  Instagram
                </a>
              )}
            </div>
          </div>
          
          {/* Social Stats */}
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{mockProfile.social_stats.posts}</div>
              <div className="text-xs text-luxury-400">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{mockProfile.social_stats.followers.toLocaleString()}</div>
              <div className="text-xs text-luxury-400">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{mockProfile.social_stats.following}</div>
              <div className="text-xs text-luxury-400">Following</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{mockProfile.social_stats.likes_received.toLocaleString()}</div>
              <div className="text-xs text-luxury-400">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-luxury border-white/10 p-1 rounded-xl">
          <TabsTrigger value="stats" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text">
            Stats
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text">
            Activity
          </TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-luxury-900 text-luxury-300 rounded-lg luxury-text">
            Photos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6 mt-6">
          {/* Hiking Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mountain className="h-5 w-5 mr-2" />
                  Hiking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{mockProfile.hiking_stats.total_hikes}</div>
                    <div className="text-sm text-luxury-400">Total Hikes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{mockProfile.hiking_stats.total_distance}</div>
                    <div className="text-sm text-luxury-400">Miles Hiked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{(mockProfile.hiking_stats.total_elevation / 1000).toFixed(1)}K</div>
                    <div className="text-sm text-luxury-400">Elevation Gain (ft)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{mockProfile.hiking_stats.total_time}</div>
                    <div className="text-sm text-luxury-400">Hours Hiking</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-luxury-400">Longest Hike</span>
                    <span className="text-white font-medium">{mockProfile.hiking_stats.longest_hike} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-400">Highest Peak</span>
                    <span className="text-white font-medium">{mockProfile.hiking_stats.highest_elevation.toLocaleString()} ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-400">Current Streak</span>
                    <span className="text-white font-medium">{mockProfile.hiking_stats.current_streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-400">Best Streak</span>
                    <span className="text-white font-medium">{mockProfile.hiking_stats.best_streak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProfile.achievements.map((achievement) => (
              <Card key={achievement.id} className={`luxury-card border-white/10 ${
                achievement.unlocked 
                  ? 'bg-gold-gradient/10 border-gold-500/30' 
                  : 'bg-white/5 backdrop-blur-luxury'
              }`}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className={`font-semibold mb-1 ${achievement.unlocked ? 'text-gold-300' : 'text-white'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-luxury-400 mb-3">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                      Unlocked {formatDistanceToNow(new Date(achievement.unlocked_at!), { addSuffix: true })}
                    </Badge>
                  ) : achievement.progress && achievement.max_progress ? (
                    <div className="space-y-2">
                      <Progress value={(achievement.progress / achievement.max_progress) * 100} className="h-2" />
                      <p className="text-xs text-luxury-400">
                        {achievement.progress} / {achievement.max_progress}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-luxury-800/50 border-luxury-600/30 text-luxury-400">
                      Locked
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-12 rounded-xl text-center">
            <Calendar className="h-16 w-16 text-luxury-400 mx-auto mb-6" />
            <h3 className="text-xl luxury-heading text-white mb-4">Recent Activity</h3>
            <p className="text-luxury-400 luxury-text max-w-md mx-auto">
              Activity feed showing recent hikes, posts, and social interactions will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6 mt-6">
          <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-12 rounded-xl text-center">
            <Camera className="h-16 w-16 text-luxury-400 mx-auto mb-6" />
            <h3 className="text-xl luxury-heading text-white mb-4">Photo Gallery</h3>
            <p className="text-luxury-400 luxury-text max-w-md mx-auto">
              A beautiful grid of hiking photos and memories will be displayed here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUserProfile;
