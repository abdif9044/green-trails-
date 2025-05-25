
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTrailInteractions = (trailId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { toast } = useToast();

  const toggleLike = async () => {
    try {
      // Toggle like state
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // Show success message
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        description: isLiked ? "Trail removed from your favorites" : "Trail added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert state on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
  };
};
