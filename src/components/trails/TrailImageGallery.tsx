
import { useState } from 'react';
import { useTrailImages, useDeleteTrailImage, type TrailImage } from '@/hooks/use-trail-images';
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client'; // Added the missing import
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TrailImageGalleryProps {
  trailId: string;
  userId?: string;
}

const TrailImageGallery = ({ trailId, userId }: TrailImageGalleryProps) => {
  const { data: images, isLoading } = useTrailImages(trailId);
  const { mutate: deleteImage, isPending } = useDeleteTrailImage(trailId); // Changed isLoading to isPending
  const [selectedImage, setSelectedImage] = useState<TrailImage | null>(null);
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
        <div key={image.id} className="relative group">
          <img
            src={supabase.storage.from('trail_images').getPublicUrl(image.image_path).data.publicUrl}
            alt={image.caption || 'Trail image'}
            className="w-full h-48 object-cover rounded-lg"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
              {image.caption}
            </div>
          )}
          {(user?.id === image.user_id || user?.id === userId) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this image? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteImage(image.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrailImageGallery;
