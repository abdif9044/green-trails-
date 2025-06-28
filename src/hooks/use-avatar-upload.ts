
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';

// Accepts only jpeg, png, webp
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Compress image (use native browser APIs)
  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      if (!window.HTMLCanvasElement) {
        resolve(file); // Can't compress, fallback
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          } else {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const ext = file.name.split('.').pop() || 'jpg';
            resolve(new File([blob], `avatar.${ext}`, { type: file.type }));
          } else {
            resolve(file);
          }
        }, file.type, 0.8);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  }

  async function validateFile(file?: File): Promise<{ valid: boolean; message?: string }> {
    if (!file) return { valid: false, message: 'No file provided' };
    if (!ALLOWED_TYPES.includes(file.type))
      return { valid: false, message: 'Invalid file type (jpg, png, webp only)' };
    if (file.size > MAX_FILE_SIZE)
      return { valid: false, message: 'Avatar file too large (max 5MB)' };
    return { valid: true };
  }

  async function uploadAvatar({
    file,
    userId,
    onSuccess,
    onError,
  }: {
    file: File;
    userId: string;
    onSuccess?: (url: string) => void;
    onError?: (err: Error) => void;
  }) {
    setUploading(true);
    try {
      const { valid, message } = await validateFile(file);
      if (!valid) throw new Error(message);

      const compressed = await compressImage(file);

      const ext = compressed.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/${uuidv4()}.${ext}`;

      // Upload to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, compressed, {
          cacheControl: '3600',
          upsert: true
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

      if (!data?.publicUrl) throw new Error('Could not get public avatar URL.');
      onSuccess?.(data.publicUrl);
      toast({ title: "Avatar uploaded", description: "Your new profile picture was updated." });
      return data.publicUrl;
    } catch (err: any) {
      toast({
        title: "Avatar upload error",
        description: err.message || "Failed to upload avatar.",
        variant: "destructive"
      });
      onError?.(err);
      return '';
    } finally {
      setUploading(false);
    }
  }

  return { uploading, uploadAvatar, validateFile };
}
