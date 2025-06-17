
import { supabase } from '@/integrations/supabase/client';

export interface MediaItem {
  id: string;
  album_id: string;
  url: string;
  file_type: string;
  caption?: string;
  created_at: string;
}

export interface Album {
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

class MediaService {
  async uploadMedia(file: File, albumId: string, caption?: string): Promise<MediaItem | null> {
    try {
      // Since media and albums tables don't exist, return mock data
      console.warn('Media and albums tables do not exist, returning mock media item');
      
      return {
        id: crypto.randomUUID(),
        album_id: albumId,
        url: URL.createObjectURL(file),
        file_type: file.type,
        caption: caption,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  }

  async getAlbumMedia(albumId: string): Promise<MediaItem[]> {
    try {
      // Since albums and media tables don't exist, return empty array
      console.warn('Albums and media tables do not exist, returning empty media items');
      return [];
    } catch (error) {
      console.error('Error fetching album media:', error);
      return [];
    }
  }

  async createAlbum(albumData: Partial<Album>): Promise<Album | null> {
    try {
      // Since albums table doesn't exist, return mock album
      console.warn('Albums table does not exist, returning mock album');
      
      return {
        id: crypto.randomUUID(),
        title: albumData.title || 'Untitled Album',
        description: albumData.description,
        location: albumData.location,
        is_private: albumData.is_private || false,
        user_id: albumData.user_id || '',
        trail_id: albumData.trail_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating album:', error);
      return null;
    }
  }

  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      // Since media table doesn't exist, just return true
      console.warn('Media table does not exist, simulating media deletion');
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }

  async updateMediaCaption(mediaId: string, caption: string): Promise<boolean> {
    try {
      // Since media table doesn't exist, just return true
      console.warn('Media table does not exist, simulating caption update');
      return true;
    } catch (error) {
      console.error('Error updating media caption:', error);
      return false;
    }
  }
}

export const mediaService = new MediaService();
export default mediaService;
