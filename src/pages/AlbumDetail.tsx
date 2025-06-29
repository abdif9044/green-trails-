
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
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
        {/* Album Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
          {album.description && (
            <p className="text-muted-foreground mb-4">{album.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created: {new Date(album.created_at).toLocaleDateString()}</span>
            <span>Public</span>
          </div>
        </div>
        
        {/* Album Actions */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {album.album_media?.length || 0} photos
            </span>
          </div>
        </div>
        
        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {album.album_media?.map((media: any, index: number) => (
            <div key={media.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={media.file_path}
                alt={media.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {media.caption && (
                <div className="p-2 bg-black bg-opacity-50 text-white text-sm">
                  {media.caption}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {(!album.album_media || album.album_media.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No photos in this album yet.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AlbumDetail;
