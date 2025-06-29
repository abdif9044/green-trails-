
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCreateAlbum = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateAlbum = async (
    title: string, 
    description: string, 
    location: string, 
    isPrivate: boolean, 
    files: File[], 
    userLocation: { lat: number, lng: number } | null
  ) => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your album",
        variant: "destructive"
      });
      return false;
    }
    
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one photo or video to your album",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be signed in to create an album');
      }
      
      // Create album
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
          title,
          description,
          location,
          is_private: isPrivate,
          user_id: user.id,
          // Add coordinates if using location
          ...(userLocation ? {
            coordinates: `POINT(${userLocation.lng} ${userLocation.lat})`
          } : {})
        })
        .select()
        .single();
      
      if (albumError) throw albumError;
      
      // Upload files
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Add to album_media table instead of media table
        const { error: mediaError } = await supabase
          .from('album_media')
          .insert({
            album_id: album.id,
            user_id: user.id,
            file_path: filePath,
            file_type: file.type,
            caption: ''
          });
        
        if (mediaError) throw mediaError;
      }
      
      toast({
        title: "Album Created",
        description: "Your album has been created successfully"
      });
      
      navigate('/social');
      return true;
      
    } catch (error: any) {
      console.error('Error creating album:', error);
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleCreateAlbum,
    isSubmitting
  };
};
