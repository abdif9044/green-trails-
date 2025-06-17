
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useCreateAlbum } from '@/hooks/use-create-album';
import AlbumFormHeader from './album-form/AlbumFormHeader';
import AlbumBasicFields from './album-form/AlbumBasicFields';
import LocationField from './album-form/LocationField';
import MediaUpload from './album-form/MediaUpload';
import AlbumFormActions from './album-form/AlbumFormActions';

interface AlbumFormProps {
  className?: string;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ className }) => {
  const { user } = useAuth();
  const createAlbumMutation = useCreateAlbum();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [useLocation, setUseLocation] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const albumData = {
      title,
      description,
      location,
      is_private: isPrivate,
    };

    const mediaFiles = files.map(file => ({ file }));

    createAlbumMutation.mutate({ albumData, mediaFiles });
  };

  const canSubmit = title.trim() && files.length > 0;
  const isSubmitting = createAlbumMutation.isPending;

  return (
    <Card className={className}>
      <AlbumFormHeader />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlbumBasicFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          
          <LocationField
            location={location}
            setLocation={setLocation}
            setUserLocation={setUserLocation}
            setUseLocation={setUseLocation}
          />
          
          <MediaUpload
            files={files}
            setFiles={setFiles}
            previews={previews}
            setPreviews={setPreviews}
          />
          
          <AlbumFormActions
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AlbumForm;
