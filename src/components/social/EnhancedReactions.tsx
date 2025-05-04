
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, SmilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Define available reactions
const reactions = [
  { emoji: '❤️', name: 'heart', count: 0 },
  { emoji: '👍', name: 'thumbs_up', count: 0 },
  { emoji: '👏', name: 'clap', count: 0 },
  { emoji: '😂', name: 'laugh', count: 0 },
  { emoji: '🔥', name: 'fire', count: 0 },
  { emoji: '🌿', name: 'herb', count: 0 },
  { emoji: '🥾', name: 'hiking_boot', count: 0 },
  { emoji: '⛰️', name: 'mountain', count: 0 }
];

interface EnhancedReactionsProps {
  itemId: string;
  itemType: 'post' | 'comment' | 'album' | 'photo';
  initialReactions?: Record<string, number>;
  initialUserReaction?: string | null;
}

const EnhancedReactions: React.FC<EnhancedReactionsProps> = ({
  itemId,
  itemType,
  initialReactions = {},
  initialUserReaction = null
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userReaction, setUserReaction] = useState<string | null>(initialUserReaction);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(() => {
    // Initialize counts from props or default to 0 for each reaction
    const counts: Record<string, number> = {};
    reactions.forEach(r => {
      counts[r.name] = initialReactions[r.name] || 0;
    });
    return counts;
  });
  
  const handleReaction = async (reactionName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to this content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // If user already has this reaction, remove it
      if (userReaction === reactionName) {
        setReactionCounts({
          ...reactionCounts,
          [reactionName]: Math.max(0, reactionCounts[reactionName] - 1)
        });
        setUserReaction(null);
        
        // Here we would call an API to remove the reaction
        // await removeReaction(itemId, itemType, reactionName);
        
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
      
      // Here we would call an API to add the reaction
      // await addReaction(itemId, itemType, reactionName);
      
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Reaction failed",
        description: "There was a problem saving your reaction",
        variant: "destructive"
      });
    }
  };

  // Get total reaction count
  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  
  // Get active reactions (ones with count > 0)
  const activeReactions = reactions.filter(r => reactionCounts[r.name] > 0);

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-gray-600 dark:text-gray-400"
          >
            {userReaction ? (
              <span className="mr-1 text-lg">
                {reactions.find(r => r.name === userReaction)?.emoji}
              </span>
            ) : (
              <SmilePlus className="h-4 w-4 mr-1" />
            )}
            <span className="text-xs font-normal">
              {userReaction ? "You reacted" : "React"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.name}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-xl ${
                  userReaction === reaction.name ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => handleReaction(reaction.name)}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Display active reactions summary */}
      {activeReactions.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex -space-x-1">
            {activeReactions.slice(0, 3).map((reaction) => (
              <span key={reaction.name} className="text-lg">
                {reaction.emoji}
              </span>
            ))}
          </span>
          {totalReactions > 0 && (
            <span className="text-xs ml-1">{totalReactions}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedReactions;
