
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MapPin, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAlbumLikeCount, useHasLikedAlbum, useToggleAlbumLike } from '@/hooks/use-album-likes';
import { useAuth } from '@/hooks/use-auth';
import { Album } from '@/hooks/use-albums';
import { useToast } from '@/hooks/use-toast';

const AlbumDetail = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch album details
  const { data: album, isLoading, error } = useQuery({
    queryKey: ['album', albumId],
    queryFn: async () => {
      if (!albumId) throw new Error('Album ID is required');
      
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          user:user_id (
            id,
            email
          )
        `)
        .eq('id', albumId)
        .single();
        
      if (error) throw error;
      
      return {
        ...data,
        user: data.user && typeof data.user === 'object' ? data.user : null
      } as Album;
    },
    enabled: !!albumId,
  });
  
  // Fetch media for this album
  const { data: media = [] } = useQuery({
    queryKey: ['albumMedia', albumId],
    queryFn: async () => {
      if (!albumId) return [];
      
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        url: supabase.storage.from('media').getPublicUrl(item.file_path).data.publicUrl
      }));
    },
    enabled: !!albumId,
  });
  
  // Use album likes hooks
  const { data: likesCount = 0 } = useAlbumLikeCount(albumId || '');
  const { data: hasLiked = false } = useHasLikedAlbum(albumId || '');
  const toggleLike = useToggleAlbumLike();
  
  const handleLike = async () => {
    if (!albumId) return;
    
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Loading album...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The album you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/social')}>Back to Social Feed</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Default values for display
  const authorName = album.user?.email?.split('@')[0] || 'User';
  const authorAvatar = null; // Could be fetched from profiles in the future
  const commentsCount = 0; // Placeholder until comments are implemented
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-transparent hover:text-greentrail-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-greentrail-800">
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
          
          <div className="border-t dark:border-greentrail-700">
            <div className="p-6">
              {media.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No photos or videos in this album yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <div 
                      key={item.id} 
                      className="aspect-square bg-muted rounded-md overflow-hidden"
                    >
                      {item.file_type.startsWith('image/') ? (
                        <img 
                          src={item.url} 
                          alt={item.caption || 'Album photo'} 
                          className="w-full h-full object-cover"
                        />
                      ) : item.file_type.startsWith('video/') ? (
                        <video 
                          src={item.url} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-muted-foreground">Unsupported media type</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumDetail;
