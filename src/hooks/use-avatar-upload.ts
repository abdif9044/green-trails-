
import { useState } from 'react';

interface UploadAvatarParams {
  file: File;
  userId: string;
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
}

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);

  const validateFile = async (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, message: 'File size must be less than 5MB' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, message: 'File must be an image' };
    }

    return { valid: true };
  };

  const uploadAvatar = async ({ file, userId, onSuccess, onError }: UploadAvatarParams) => {
    setUploading(true);
    
    try {
      // For now, create a mock URL since we don't have storage configured
      const mockUrl = URL.createObjectURL(file);
      onSuccess(mockUrl);
    } catch (error) {
      onError(error as Error);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar,
    validateFile,
  };
};
