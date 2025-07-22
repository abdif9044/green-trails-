import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Camera, MapPin, Trophy, Users, TrendingUp } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  type: 'photo' | 'completion' | 'review' | 'achievement';
  content: string;
  trail: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const CommunityActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      user: { name: 'Sarah M.', avatar: '', initials: 'SM' },
      type: 'photo',
      content: 'Stunning sunrise view from the summit! The early start was totally worth it.',
      trail: 'Eagle Peak Trail',
      timestamp: '2 min ago',
      likes: 24,
      comments: 7,
      isLiked: false
    },
    {
      id: '2',
      user: { name: 'Mike R.', avatar: '', initials: 'MR' },
      type: 'completion',
      content: 'Just completed my 50th trail this year! GreenTrails helped me discover so many hidden gems.',
      trail: 'Forest Loop',
      timestamp: '15 min ago',
      likes: 31,
      comments: 12,
      isLiked: true
    },
    {
      id: '3',
      user: { name: 'Emma L.', avatar: '', initials: 'EL' },
      type: 'achievement',
      content: 'Earned the "Early Bird" badge for completing 5 sunrise hikes!',
      trail: 'Ridge Trail',
      timestamp: '1 hour ago',
      likes: 18,
      comments: 5,
      isLiked: false
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live activity updates
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          likes: activity.likes + Math.floor(Math.random() * 2),
          comments: activity.comments + Math.floor(Math.random() * 2)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-4 h-4 text-blue-500" />;
      case 'completion': return <MapPin className="w-4 h-4 text-green-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'review': return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleLike = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { 
              ...activity, 
              isLiked: !activity.isLiked,
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
            }
          : activity
      )
    );
  };

  return (
    <Card className="w-full bg-background border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Community Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{activity.user.name}</span>
                {getActivityIcon(activity.type)}
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              
              <p className="text-sm text-foreground leading-relaxed">{activity.content}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {activity.trail}
                </Badge>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(activity.id)}
                    className={`h-auto p-1 ${activity.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs">{activity.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">{activity.comments}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommunityActivityFeed;