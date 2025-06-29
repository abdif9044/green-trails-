
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Album } from '@/hooks/use-albums';
import AlbumDetailHeader from '@/components/albums/AlbumDetailHeader';
import AlbumDetailActions from '@/components/albums/AlbumDetailActions';
import AlbumMediaGrid from '@/components/albums/AlbumMediaGrid';

// Define MediaItem type locally since it doesn't exist in the current database
interface MediaItem {
  id: string;
  file_path: string;
  file_type: string;
  caption?: string;
  created_at: string;
  url: string;
}

const AlbumDetail = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();

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
      
      // Transform to match Album interface
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        is_private: !data.is_public, // Convert is_public to is_private
        user_id: data.user_id,
        trail_id: data.trail_id,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        coverImage: data.cover_image_url || '/placeholder.svg',
        user: data.user && typeof data.user === 'object' ? data.user : null
      } as Album;
    },
    enabled: !!albumId,
  });
  
  // Fetch media for this album - using album_media table since media table doesn't exist
  const { data: media = [] } = useQuery({
    queryKey: ['albumMedia', albumId],
    queryFn: async (): Promise<MediaItem[]> => {
      if (!albumId) return [];
      
      try {
        const { data, error } = await supabase
          .from('album_media')
          .select('*')
          .eq('album_id', albumId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        return data.map(item => ({
          id: item.id,
          file_path: item.file_path,
          file_type: item.file_type,
          caption: item.caption || '',
          created_at: item.created_at,
          url: supabase.storage.from('media').getPublicUrl(item.file_path).data.publicUrl
        }));
      } catch (error) {
        console.error('Error fetching album media:', error);
        return [];
      }
    },
    enabled: !!albumId,
  });
  
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
          <AlbumDetailHeader album={album} />
          <AlbumDetailActions albumId={albumId!} />
          
          <div className="border-t dark:border-greentrail-700">
            <AlbumMediaGrid media={media} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumDetail;
