
import { Link } from 'react-router-dom';
import { Image, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Album } from '@/hooks/use-albums';

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
  
  // Default values for display
  const authorName = album.user?.email?.split('@')[0] || 'User';
  const authorAvatar = null; // Could be fetched from profiles in the future
  const likesCount = 0; // Placeholder until likes are implemented
  const commentsCount = 0; // Placeholder until comments are implemented
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={authorAvatar || undefined} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
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
            <p className="text-sm text-muted-foreground">{location}</p>
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
          <Button variant="ghost" size="sm" className="space-x-1">
            <Heart className="h-4 w-4" />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{commentsCount}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
