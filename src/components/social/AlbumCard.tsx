
import { Link } from 'react-router-dom';
import { Image, Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Album } from '@/hooks/use-albums';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

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
  
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  
  // Default values for display
  const authorName = album.user?.email?.split('@')[0] || 'User';
  const authorAvatar = null; // Could be fetched from profiles in the future
  const likesCount = liked ? 1 : 0; // Placeholder until likes are implemented
  const commentsCount = 0; // Placeholder until comments are implemented
  
  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Unliked" : "Liked",
      description: liked ? "You've unliked this album" : "You've liked this album",
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/albums/${id}`);
    toast({
      title: "Link copied",
      description: "Album link copied to clipboard",
    });
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
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`space-x-1 ${liked ? 'text-red-500' : ''}`} 
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{commentsCount}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
