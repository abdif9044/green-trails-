
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Play } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  isViewed: boolean;
  storyCount: number;
}

const LiveStoriesSection: React.FC = () => {
  const { user } = useAuth();
  
  // Mock stories data
  const [stories] = useState<Story[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'Mountain Explorer',
      avatarUrl: '/placeholder.svg',
      isViewed: false,
      storyCount: 3
    },
    {
      id: '2',
      userId: 'user2',
      username: 'Trail Blazer',
      avatarUrl: '/placeholder.svg',
      isViewed: true,
      storyCount: 2
    },
    {
      id: '3',
      userId: 'user3',
      username: 'Nature Lover',
      avatarUrl: '/placeholder.svg',
      isViewed: false,
      storyCount: 1
    },
    {
      id: '4',
      userId: 'user4',
      username: 'Adventure Seeker',
      avatarUrl: '/placeholder.svg',
      isViewed: false,
      storyCount: 4
    }
  ]);

  return (
    <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg luxury-heading text-white">Live Adventures</h3>
        <span className="text-sm luxury-text text-luxury-400">{stories.length} active</span>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Add Story Button (if user is logged in) */}
        {user && (
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="relative">
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-gold-gradient hover:shadow-gold text-luxury-900 p-0"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <span className="text-xs luxury-text text-luxury-300 text-center w-16 truncate">
              Your Story
            </span>
          </div>
        )}

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group">
            <div className="relative">
              {/* Story Ring */}
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gradient-to-r from-luxury-400 to-luxury-600' 
                  : 'bg-gradient-to-r from-gold-400 via-greentrail-400 to-gold-600'
              } group-hover:scale-110 transition-transform duration-300`}>
                <Avatar className="w-full h-full ring-2 ring-luxury-900">
                  <AvatarImage src={story.avatarUrl} />
                  <AvatarFallback className="bg-luxury-gradient text-white font-luxury font-semibold">
                    {story.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Story Count Indicator */}
              {story.storyCount > 1 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-luxury-900">{story.storyCount}</span>
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="h-3 w-3 text-white fill-current" />
                </div>
              </div>
            </div>
            
            <span className="text-xs luxury-text text-luxury-300 text-center w-16 truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStoriesSection;
