
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseSetupService } from './database/setup-service';

export interface MediaUploadOptions {
  file: File;
  caption?: string;
  albumId?: string;
  trailId?: string;
  isPrivate?: boolean;
}

interface MediaMetadata {
  userId: string;
  albumId?: string;
  trailId?: string;
  caption?: string;
}

export class MediaService {
  /**
   * Upload media file (image or video) to Supabase storage
   */
  static async uploadMedia({ file, caption, albumId, trailId, isPrivate = false }: MediaUploadOptions) {
    try {
      // Check that user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to upload media');
      }
      
      // First, ensure the media bucket exists
      await DatabaseSetupService.ensureMediaBucketExists();

      // Generate a unique file path to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      // Get public URL for the uploaded file
      const fileUrl = supabase.storage
        .from('media')
        .getPublicUrl(fileName).data.publicUrl;
      
      // Create metadata record in the database
      const metadata: MediaMetadata = {
        userId: user.id,
        caption,
        albumId,
        trailId
      };
      
      // First check if we need to create an album
      if (!albumId && trailId) {
        // Create an album for this trail if one doesn't exist
        const { data: newAlbum, error: albumError } = await supabase
          .from('albums')
          .insert({
            user_id: user.id,
            title: `Trail Photos`,
            is_public: !isPrivate
          })
          .select('id')
          .single();
          
        if (albumError) {
          console.error('Error creating album:', albumError);
        } else if (newAlbum) {
          metadata.albumId = newAlbum.id;
        }
      }
      
      // Insert the media record into album_media table
      const { data: media, error: mediaError } = await supabase
        .from('album_media')
        .insert({
          user_id: user.id,
          album_id: metadata.albumId,
          file_path: fileUrl,
          caption: metadata.caption,
          file_type: file.type
        })
        .select('id')
        .single();
        
      if (mediaError) {
        console.error('Error inserting media record:', mediaError);
        throw mediaError;
      }
      
      // Log upload for security auditing
      await DatabaseSetupService.logSecurityEvent('media_upload', {
        user_id: user.id,
        media_id: media?.id,
        file_type: file.type,
        file_size: file.size,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        mediaId: media?.id,
        url: fileUrl
      };
    } catch (error) {
      console.error('Error in uploadMedia:', error);
      return {
        success: false,
        error
      };
    }
  }
  
  /**
   * Delete media from storage and database
   */
  static async deleteMedia(mediaId: string) {
    try {
      // Check that user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to delete media');
      }
      
      // Get the media record to find the file path
      const { data: media, error: fetchError } = await supabase
        .from('album_media')
        .select('*')
        .eq('id', mediaId)
        .eq('user_id', user.id) // Ensure the user owns this media
        .single();
        
      if (fetchError || !media) {
        console.error('Error fetching media:', fetchError);
        throw fetchError || new Error('Media not found');
      }
      
      // Extract the path from the full URL
      const pathParts = media.file_path.split('media/');
      const filePath = pathParts.length > 1 ? pathParts[1] : '';
      
      if (!filePath) {
        throw new Error('Invalid file path');
      }
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);
        
      if (storageError) {
        console.error('Error removing file from storage:', storageError);
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('album_media')
        .delete()
        .eq('id', mediaId)
        .eq('user_id', user.id);
        
      if (dbError) {
        console.error('Error deleting media record:', dbError);
        throw dbError;
      }
      
      // Log deletion for security auditing
      await DatabaseSetupService.logSecurityEvent('media_delete', {
        user_id: user.id,
        media_id: mediaId,
        timestamp: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error in deleteMedia:', error);
      return {
        success: false,
        error
      };
    }
  }
}

/**
 * Hook for media operations in React components
 */
export function useMediaService() {
  const uploadMedia = async (options: MediaUploadOptions) => {
    return MediaService.uploadMedia(options);
  };
  
  const deleteMedia = async (mediaId: string) => {
    return MediaService.deleteMedia(mediaId);
  };
  
  return {
    uploadMedia,
    deleteMedia
  };
}
