
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Eye, Heart, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import EmojiReactionPicker from './EmojiReactionPicker';

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

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Auto-progress timer for 15 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 100;
        }
        return prev + (100 / 150); // 15 seconds = 150 intervals of 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, onClose]);

  const handleReaction = (emoji: string) => {
    setReaction(reaction === emoji ? null : emoji);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      // Here you would send the comment to the backend
      console.log('Sending comment:', comment);
      setComment('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div 
      className="relative h-[600px] bg-black text-white rounded-lg overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-2 left-2 right-2 z-20">
        <div className="w-full bg-white/30 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-6 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={story.user.avatar_url || undefined} />
            <AvatarFallback className="bg-greentrail-600 text-white">
              {story.user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{story.user.username}</p>
            <p className="text-xs text-white/70">{formatTimeAgo(story.created_at)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Story Image */}
      <img 
        src={story.media_url} 
        alt="Story"
        className="w-full h-full object-cover"
      />

      {/* Location Badge */}
      {story.location && (
        <div className="absolute top-20 left-4 z-10">
          <Badge className="bg-black/50 text-white border-white/30">
            <MapPin className="h-3 w-3 mr-1" />
            {story.location}
          </Badge>
        </div>
      )}

      {/* View count */}
      <div className="absolute bottom-20 left-4 z-10">
        <div className="flex items-center gap-1 text-white/70 text-sm">
          <Eye className="h-4 w-4" />
          <span>{story.view_count} views</span>
        </div>
      </div>

      {/* Bottom actions */}
      {user && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-2 mb-3">
            <EmojiReactionPicker 
              onReactionSelect={handleReaction}
              currentUserReaction={reaction}
            />
            {reaction && (
              <Badge className="bg-white/20 text-white border-white/30">
                <span className="mr-1">{reaction}</span>
                You reacted
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Reply to story..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
            />
            <Button 
              size="sm" 
              className="bg-greentrail-600 hover:bg-greentrail-700"
              onClick={handleSendComment}
              disabled={!comment.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
