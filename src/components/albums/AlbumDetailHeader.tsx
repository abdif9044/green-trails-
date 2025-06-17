
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Album } from '@/hooks/use-albums';
import { formatDistanceToNow } from 'date-fns';

interface AlbumDetailHeaderProps {
  album: Album;
  mediaCount?: number;
}

const AlbumDetailHeader = ({ album, mediaCount }: AlbumDetailHeaderProps) => {
  const authorName = album.user?.email?.split('@')[0] || 'User';
  const authorAvatar = null; // Could be fetched from profiles in the future

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={authorAvatar || undefined} />
            <AvatarFallback className="text-lg">{authorName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{album.title}</h2>
            <div className="flex items-center mt-1">
              <Link to={`/profile/${album.user_id}`} className="text-sm text-greentrail-600 dark:text-greentrail-400 hover:underline">
                {authorName}
              </Link>
              <span className="text-xs text-muted-foreground mx-2">•</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(album.created_at), { addSuffix: true })}
              </span>
              {mediaCount !== undefined && (
                <>
                  <span className="text-xs text-muted-foreground mx-2">•</span>
                  <span className="text-xs text-muted-foreground">
                    {mediaCount} {mediaCount === 1 ? 'item' : 'items'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {album.is_private && (
          <Badge variant="secondary">Private</Badge>
        )}
      </div>
      
      {album.location && (
        <p className="text-sm text-muted-foreground flex items-center mb-4">
          <MapPin className="h-4 w-4 mr-1" /> {album.location}
        </p>
      )}
      
      {album.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-6">{album.description}</p>
      )}
    </div>
  );
};

export default AlbumDetailHeader;
