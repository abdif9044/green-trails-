
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, SmilePlus, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import EmojiReactionPicker from './EmojiReactionPicker';

// Enhanced reaction categories
const reactions = [
  // General emotions
  { emoji: '❤️', name: 'heart', label: 'Love' },
  { emoji: '👍', name: 'thumbs_up', label: 'Like' },
  { emoji: '👏', name: 'clap', label: 'Applause' },
  { emoji: '😂', name: 'laugh', label: 'Funny' },
  { emoji: '🤩', name: 'star_eyes', label: 'Amazing' },
  { emoji: '😍', name: 'heart_eyes', label: 'Love it' },
  
  // Hiking specific
  { emoji: '🥾', name: 'hiking_boot', label: 'Epic hike' },
  { emoji: '⛰️', name: 'mountain', label: 'Great view' },
  { emoji: '🌲', name: 'evergreen', label: 'Beautiful nature' },
  { emoji: '🏔️', name: 'snow_mountain', label: 'Summit' },
  { emoji: '🌿', name: 'herb', label: 'Green trails' },
  { emoji: '🗻', name: 'mount_fuji', label: 'Peak achieved' },
  
  // Weather & nature
  { emoji: '☀️', name: 'sun', label: 'Perfect weather' },
  { emoji: '🌙', name: 'moon', label: 'Night hike' },
  { emoji: '⭐', name: 'star', label: 'Stargazing' },
  { emoji: '🌈', name: 'rainbow', label: 'After the rain' },
  
  // Adventure emotions
  { emoji: '🔥', name: 'fire', label: 'Lit' },
  { emoji: '💪', name: 'muscle', label: 'Strong' },
  { emoji: '⚡', name: 'lightning', label: 'Energized' },
  { emoji: '🚀', name: 'rocket', label: 'Motivated' },
  { emoji: '🏆', name: 'trophy', label: 'Achievement' }
];

interface EnhancedReactionsProps {
  itemId: string;
  itemType: 'post' | 'comment' | 'album' | 'photo' | 'story';
  initialReactions?: Record<string, number>;
  initialUserReaction?: string | null;
  showComments?: boolean;
  commentCount?: number;
  onCommentClick?: () => void;
  showShare?: boolean;
  onShare?: () => void;
}

const EnhancedReactions: React.FC<EnhancedReactionsProps> = ({
  itemId,
  itemType,
  initialReactions = {},
  initialUserReaction = null,
  showComments = true,
  commentCount = 0,
  onCommentClick,
  showShare = true,
  onShare
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userReaction, setUserReaction] = useState<string | null>(initialUserReaction);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    reactions.forEach(r => {
      counts[r.name] = initialReactions[r.name] || 0;
    });
    return counts;
  });
  
  const handleReaction = async (emojiOrName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to this content",
        variant: "destructive"
      });
      return;
    }
    
    // Find the reaction (could be emoji or name)
    const reaction = reactions.find(r => r.emoji === emojiOrName || r.name === emojiOrName);
    if (!reaction) return;
    
    try {
      const reactionName = reaction.name;
      
      // If user already has this reaction, remove it
      if (userReaction === reactionName) {
        setReactionCounts({
          ...reactionCounts,
          [reactionName]: Math.max(0, reactionCounts[reactionName] - 1)
        });
        setUserReaction(null);
        
        toast({
          title: "Reaction removed",
          description: `Removed your ${reaction.label.toLowerCase()} reaction`,
        });
        
        return;
      }
      
      // If user has a different reaction, remove old one and add new one
      if (userReaction) {
        setReactionCounts({
          ...reactionCounts,
          [userReaction]: Math.max(0, reactionCounts[userReaction] - 1),
          [reactionName]: (reactionCounts[reactionName] || 0) + 1
        });
      } else {
        // Just add the new reaction
        setReactionCounts({
          ...reactionCounts,
          [reactionName]: (reactionCounts[reactionName] || 0) + 1
        });
      }
      
      setUserReaction(reactionName);
      
      toast({
        title: "Reaction added",
        description: `You reacted with ${reaction.emoji} ${reaction.label}`,
      });
      
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Reaction failed",
        description: "There was a problem saving your reaction",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      const url = `${window.location.origin}/${itemType}/${itemId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Link has been copied to your clipboard",
      });
    }
  };

  // Get total reaction count
  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  
  // Get active reactions (ones with count > 0)
  const activeReactions = reactions.filter(r => reactionCounts[r.name] > 0);
  
  // Get user's current reaction emoji
  const userReactionEmoji = userReaction ? reactions.find(r => r.name === userReaction)?.emoji : null;

  return (
    <div className="flex items-center justify-between pt-3">
      <div className="flex items-center gap-1">
        <EmojiReactionPicker 
          onReactionSelect={handleReaction}
          currentUserReaction={userReactionEmoji}
        />
        
        {showComments && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-gray-600 dark:text-gray-400"
            onClick={onCommentClick}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs font-normal">
              {commentCount > 0 ? commentCount : 'Comment'}
            </span>
          </Button>
        )}
        
        {showShare && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-gray-600 dark:text-gray-400"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs font-normal">Share</span>
          </Button>
        )}
      </div>
      
      {/* Display active reactions summary */}
      {activeReactions.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex -space-x-1">
            {activeReactions.slice(0, 3).map((reaction) => (
              <span 
                key={reaction.name} 
                className="text-base bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-200 dark:border-gray-700"
                title={`${reactionCounts[reaction.name]} ${reaction.label}`}
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
          {totalReactions > 0 && (
            <span className="text-xs ml-1 font-medium">{totalReactions}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedReactions;
