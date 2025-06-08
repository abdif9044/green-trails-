
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAlbumLikeCount, useHasLikedAlbum, useToggleAlbumLike } from '@/hooks/use-album-likes';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface AlbumDetailActionsProps {
  albumId: string;
}

const AlbumDetailActions = ({ albumId }: AlbumDetailActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: likesCount = 0 } = useAlbumLikeCount(albumId);
  const { data: hasLiked = false } = useHasLikedAlbum(albumId);
  const toggleLike = useToggleAlbumLike();
  
  const commentsCount = 0; // Placeholder until comments are implemented
  
  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to like albums",
        variant: "destructive",
      });
      return;
    }
    
    await toggleLike.mutateAsync(albumId);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Album link copied to clipboard",
    });
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4">
        <Button 
          variant="ghost" 
          className={`space-x-2 ${hasLiked ? 'text-red-500' : ''}`} 
          onClick={handleLike}
          disabled={toggleLike.isPending}
        >
          <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        <Button variant="ghost" className="space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          <Share2 className="h-5 w-5 mr-2" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
};

export default AlbumDetailActions;
