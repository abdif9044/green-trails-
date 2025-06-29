
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAlbums } from '@/hooks/use-albums';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import AlbumDetailHeader from '@/components/albums/AlbumDetailHeader';
import AlbumDetailActions from '@/components/albums/AlbumDetailActions';
import AlbumMediaGrid from '@/components/albums/AlbumMediaGrid';
import { Card, CardContent } from '@/components/ui/card';

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Get single album data
  const { data: album, isLoading: albumLoading } = useQuery({
    queryKey: ['album', id],
    queryFn: async () => {
      if (!id) throw new Error('Album ID is required');
      
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          album_media(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (albumLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Album Not Found</h1>
                <p className="text-muted-foreground">
                  The album you're looking for doesn't exist or has been removed.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title={`${album.title} - GreenTrails`}
        description={album.description || `View photos from ${album.title}`}
        type="article"
      />
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <AlbumDetailHeader
          title={album.title}
          description={album.description}
          createdAt={album.created_at}
          username="trail_explorer" // Mock username since we don't have user data
          location="Unknown Location" // Mock location
          trailName={null} // Mock trail name
        />
        
        <AlbumDetailActions
          albumId={album.id}
          isOwner={false} // Mock ownership - would check if current user owns this album
          isPublic={album.is_public}
        />
        
        <AlbumMediaGrid
          albumId={album.id}
          media={album.album_media || []}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumDetail;
