
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AlbumDetailHeader from '@/components/albums/AlbumDetailHeader';
import AlbumDetailActions from '@/components/albums/AlbumDetailActions';
import AlbumMediaGrid from '@/components/albums/AlbumMediaGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  description?: string;
  location?: string;
  is_private: boolean;
  user_id: string;
  trail_id?: string;
  created_at: string;
  updated_at: string;
}

interface MediaItem {
  id: string;
  album_id: string;
  url: string;
  caption?: string;
  created_at: string;
}

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch album details with fallback for missing albums table
  const { data: album, isLoading: albumLoading, error: albumError } = useQuery({
    queryKey: ['album', id],
    queryFn: async (): Promise<Album | null> => {
      if (!id) return null;
      
      try {
        // Since albums table doesn't exist, return null
        console.warn('Albums table does not exist, returning null');
        return null;
      } catch (error) {
        console.error('Error fetching album:', error);
        return null;
      }
    },
    enabled: !!id,
  });

  // Fetch media items with fallback for missing media table
  const { data: mediaItems, isLoading: mediaLoading } = useQuery({
    queryKey: ['album-media', id],
    queryFn: async (): Promise<MediaItem[]> => {
      if (!id) return [];
      
      try {
        // Since media table doesn't exist, return empty array
        console.warn('Media table does not exist, returning empty array');
        return [];
      } catch (error) {
        console.error('Error fetching album media:', error);
        return [];
      }
    },
    enabled: !!id && !!album,
  });

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Album ID is required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (albumLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (albumError || !album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Albums feature is not yet available. This page will be functional once the albums database table is created.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <AlbumDetailHeader 
        album={album}
        mediaCount={mediaItems?.length || 0}
      />
      
      <AlbumDetailActions 
        album={album}
      />
      
      <AlbumMediaGrid 
        mediaItems={mediaItems || []}
        isLoading={mediaLoading}
      />
    </div>
  );
};

export default AlbumDetail;
