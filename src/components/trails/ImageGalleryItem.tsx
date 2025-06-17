
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Loader2,
  StarIcon,
  MoreVertical,
  ImageIcon
} from 'lucide-react';
import { TrailImage } from '@/hooks/trail-images/types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';

interface ImageGalleryItemProps {
  image: TrailImage;
  canDelete: boolean;
  canSetPrimary?: boolean;
  onDelete: (imageId: string) => void;
  onSetPrimary?: (imageId: string) => void;
  isDeleting: boolean;
  isSettingPrimary?: boolean;
}

const DEFAULT_TRAIL_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e";

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ 
  image, 
  canDelete, 
  canSetPrimary = false,
  onDelete,
  onSetPrimary,
  isDeleting,
  isSettingPrimary = false
}) => {
  // Use the url directly as it's already a full URL from the database
  let imageUrl = image.full_image_url || image.url || DEFAULT_TRAIL_IMAGE;
  
  // If no URL is available, use default
  if (!imageUrl) {
    imageUrl = DEFAULT_TRAIL_IMAGE;
  }
    
  return (
    <div className="relative group rounded-lg overflow-hidden border border-greentrail-100 dark:border-greentrail-800 shadow-sm">
      <div className="h-48 bg-muted">
        <LazyImage
          src={imageUrl}
          alt={image.caption || 'Trail image'}
          className="w-full h-full"
          fallbackImage={DEFAULT_TRAIL_IMAGE}
          objectFit="cover"
        />
      </div>
      
      {image.is_primary && (
        <Badge className="absolute top-2 left-2 bg-greentrail-600 text-white">
          <StarIcon className="h-3 w-3 mr-1" /> Primary
        </Badge>
      )}
      
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 truncate">
          {image.caption}
        </div>
      )}
      
      {(canDelete || canSetPrimary) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isDeleting || isSettingPrimary}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canSetPrimary && onSetPrimary && (
              <DropdownMenuItem 
                onClick={() => onSetPrimary(image.id)}
                disabled={isSettingPrimary}
              >
                <StarIcon className="h-4 w-4 mr-2" />
                {isSettingPrimary ? 'Setting as primary...' : 'Set as primary image'}
              </DropdownMenuItem>
            )}
            
            {canDelete && (
              <>
                {canSetPrimary && <DropdownMenuSeparator />}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete image
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
                        {image.is_primary && (
                          <p className="font-semibold mt-2 text-destructive">
                            Warning: This is the primary image for this trail.
                          </p>
                        )}
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ImageGalleryItem;
