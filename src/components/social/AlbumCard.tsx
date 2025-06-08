
import { Link } from 'react-router-dom';
import { Image, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Album } from '@/hooks/use-albums';
import { formatDistanceToNow } from 'date-fns';
import { useAlbumLikeCount, useHasLikedAlbum } from '@/hooks/use-album-likes';
import EnhancedReactions from './EnhancedReactions';

// Props interface now accepts the album object directly
export interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const {
    id,
    title,
    description,
    location,
    is_private,
    created_at,
    user_id
  } = album;
  
  // Use the album likes hooks
  const { data: likesCount = 0 } = useAlbumLikeCount(id);
  const { data: hasLiked = false } = useHasLikedAlbum(id);
  
  // Default values for display
  const authorName = album.user?.email?.split('@')[0] || 'User';
  const authorAvatar = null; // Could be fetched from profiles in the future
  const commentsCount = 0; // Placeholder until comments are implemented
  
  // Create reactions data for EnhancedReactions
  const initialReactions = {
    heart: hasLiked ? 1 : 0, // Map like to heart reaction
    // Add other reactions from database when available
  };
  
  const handleCommentClick = () => {
    // Navigate to album detail with focus on comments
    // This would be implemented when comment system is added
    console.log('Navigate to comments for album:', id);
  };
  
  const handleShare = () => {
    const url = `${window.location.origin}/albums/${id}`;
    navigator.clipboard.writeText(url);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={authorAvatar || undefined} />
            <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${user_id}`} className="font-semibold hover:underline">
                {authorName}
              </Link>
              {is_private && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            {location && (
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {created_at ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) : 'Recently'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <Link to={`/albums/${id}`}>
        <div className="relative aspect-video bg-muted">
          <div className="flex items-center justify-center h-full">
            <Image className="h-12 w-12 text-muted-foreground/50" />
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <EnhancedReactions
          itemId={id}
          itemType="album"
          initialReactions={initialReactions}
          initialUserReaction={hasLiked ? 'heart' : null}
          commentCount={commentsCount}
          onCommentClick={handleCommentClick}
          onShare={handleShare}
        />
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
