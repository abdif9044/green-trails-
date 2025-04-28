
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from 'lucide-react';
import { TrailImage } from '@/hooks/use-trail-images';
import { supabase } from '@/integrations/supabase/client';
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

interface ImageGalleryItemProps {
  image: TrailImage;
  canDelete: boolean;
  onDelete: (imageId: string) => void;
  isDeleting: boolean;
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ 
  image, 
  canDelete, 
  onDelete,
  isDeleting 
}) => {
  return (
    <div className="relative group">
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
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isDeleting}
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
                onClick={() => onDelete(image.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
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
  );
};

export default ImageGalleryItem;
