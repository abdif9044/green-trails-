
import React, { useState } from 'react';
import { useTrailImages, useDeleteTrailImage, useSetPrimaryImage } from '@/hooks/trail-images';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import ImageGalleryItem from './ImageGalleryItem';
import { Button } from '@/components/ui/button';
import TrailImageUpload from './TrailImageUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';

interface TrailImageGalleryProps {
  trailId: string;
  userId?: string;
}

const TrailImageGallery = ({ trailId, userId }: TrailImageGalleryProps) => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: images, isLoading } = useTrailImages(trailId);
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteTrailImage(trailId);
  const { mutate: setPrimary, isPending: isSettingPrimary } = useSetPrimaryImage(trailId);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const hasPrimaryImage = images?.some(img => img.is_primary);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
          Trail Images
        </h3>
        
        {user && (
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button 
                size={isMobile ? "sm" : "default"} 
                className="bg-greentrail-600 hover:bg-greentrail-700"
              >
                <Plus className="mr-1 h-4 w-4" /> 
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Trail Image</DialogTitle>
              </DialogHeader>
              <TrailImageUpload 
                trailId={trailId} 
                onSuccess={() => setUploadOpen(false)}
                hasPrimaryImage={hasPrimaryImage} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {!images?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          No images available for this trail yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <ImageGalleryItem
              key={image.id}
              image={image}
              canDelete={user?.id === image.user_id || user?.id === userId}
              canSetPrimary={!!user && !image.is_primary && !isSettingPrimary}
              onDelete={deleteImage}
              onSetPrimary={setPrimary}
              isDeleting={isDeleting}
              isSettingPrimary={isSettingPrimary}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrailImageGallery;
