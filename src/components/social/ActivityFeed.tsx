
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MapPin, Clock, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  user_id: string;
  type: 'trail_like' | 'trail_complete' | 'album_create' | 'follow' | 'comment';
  trail_id?: string;
  album_id?: string;
  target_user_id?: string;
  content?: string;
  created_at: string;
  user: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
  trail?: {
    id: string;
    name: string;
    location: string;
    difficulty: string;
    imageUrl?: string;
  };
  album?: {
    id: string;
    title: string;
    description?: string;
  };
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchActivityFeed();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchActivityFeed = async () => {
    if (!user) return;

    try {
      // For now, show a placeholder message since the social features are being rebuilt
      console.log('Activity feed is being restored...');
      setActivities([]);
    } catch (error) {
      console.error('Error fetching activity feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trail_like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'trail_complete':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'album_create':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'follow':
        return <Heart className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const userName = activity.user.full_name || activity.user.email.split('@')[0];
    
    switch (activity.type) {
      case 'trail_like':
        return `${userName} liked ${activity.trail?.name}`;
      case 'trail_complete':
        return `${userName} completed ${activity.trail?.name}`;
      case 'album_create':
        return `${userName} created a new album: ${activity.album?.title}`;
      case 'follow':
        return `${userName} started following someone new`;
      case 'comment':
        return `${userName} commented on ${activity.trail?.name}`;
      default:
        return `${userName} was active`;
    }
  };

  const getActivityLink = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'trail_like':
      case 'trail_complete':
      case 'comment':
        return `/trail/${activity.trail_id}`;
      case 'album_create':
        return `/albums/${activity.album_id}`;
      case 'follow':
        return `/profile/${activity.target_user_id}`;
      default:
        return '#';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Feed</h2>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Activity Feed Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Social features are being restored. Check back soon to see trail adventures from other hikers!
          </p>
          <Button asChild>
            <Link to="/discover">Discover Trails</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityFeed;
