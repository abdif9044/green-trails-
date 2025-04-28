
import React from 'react';
import { useTrailImages, useDeleteTrailImage } from '@/hooks/use-trail-images';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import ImageGalleryItem from './ImageGalleryItem';

interface TrailImageGalleryProps {
  trailId: string;
  userId?: string;
}

const TrailImageGallery = ({ trailId, userId }: TrailImageGalleryProps) => {
  const { data: images, isLoading } = useTrailImages(trailId);
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteTrailImage(trailId);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  if (!images?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No images available for this trail yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageGalleryItem
          key={image.id}
          image={image}
          canDelete={user?.id === image.user_id || user?.id === userId}
          onDelete={deleteImage}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default TrailImageGallery;
