
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import StoryViewer from './StoryViewer';
import CreateStoryDialog from './CreateStoryDialog';

interface Story {
  id: string;
  user_id: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  media_url: string;
  location?: string;
  created_at: string;
  expires_at: string;
  view_count: number;
  is_viewed?: boolean;
}

// Mock data - replace with actual data from backend
const mockStories: Story[] = [
  {
    id: '1',
    user_id: 'user1',
    user: { username: 'mountainhiker', avatar_url: null },
    media_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    location: 'Yosemite National Park',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    expires_at: new Date(Date.now() + 82800000).toISOString(), // 23 hours from now
    view_count: 12,
    is_viewed: false
  },
  {
    id: '2',
    user_id: 'user2',
    user: { username: 'trailblazer', avatar_url: null },
    media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    location: 'Rocky Mountain Trail',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    expires_at: new Date(Date.now() + 79200000).toISOString(), // 22 hours from now
    view_count: 24,
    is_viewed: true
  }
];

const StoriesSection: React.FC = () => {
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1h ago';
    return `${diffInHours}h ago`;
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-3 overflow-x-auto">
        {/* Create Story Button */}
        {user && (
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gray-200 dark:border-gray-700">
                <AvatarFallback>
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-greentrail-600 hover:bg-greentrail-700"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs text-center font-medium">Your Story</span>
          </div>
        )}

        {/* Stories */}
        {mockStories.map((story) => (
          <Dialog key={story.id}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer">
                <div className="relative">
                  <Avatar className={`h-16 w-16 border-2 ${
                    story.is_viewed 
                      ? 'border-gray-300 dark:border-gray-600' 
                      : 'border-greentrail-500'
                  }`}>
                    <AvatarImage src={story.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {story.user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-75 -z-10" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium block truncate max-w-[70px]">
                    {story.user.username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(story.created_at)}
                  </span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0">
              <StoryViewer story={story} onClose={() => setSelectedStory(null)} />
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Create Story Dialog */}
      <CreateStoryDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </Card>
  );
};

export default StoriesSection;
