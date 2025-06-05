
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, Loader2, UploadCloud } from 'lucide-react';
import { useUploadTrailImage } from '@/hooks/trail-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrailImageUploadProps {
  trailId: string;
  onSuccess?: () => void;
  hasPrimaryImage?: boolean;
}

const TrailImageUpload = ({ trailId, onSuccess, hasPrimaryImage = false }: TrailImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { mutate: uploadImage, isPending } = useUploadTrailImage(trailId);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };
  
  const handleFile = (file?: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return;
    }
    
    // Removed file size validation to allow any size image
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Auto-set as primary if no primary image exists
    if (!hasPrimaryImage) {
      setIsPrimary(true);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };
  
  const handleSubmit = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }
    
    uploadImage(
      { file, caption, isPrimary },
      {
        onSuccess: () => {
          setCaption('');
          setIsPrimary(false);
          setPreviewUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          onSuccess?.();
        },
      }
    );
  };
  
  const clearSelection = () => {
    setPreviewUrl(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition-colors",
          dragActive ? "border-greentrail-500 bg-greentrail-50 dark:bg-greentrail-950/20" : "border-gray-300 dark:border-gray-700",
          previewUrl ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isPending}
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-contain w-full h-full rounded" 
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1"
              onClick={clearSelection}
              disabled={isPending}
            >
              &times;
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
            <UploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-greentrail-600 dark:text-greentrail-400">
                Click to upload
              </span> or drag and drop
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600">
              PNG, JPG or WEBP (any size)
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              <Image className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>
        )}
      </div>
      
      {previewUrl && (
        <>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption to your image..."
              disabled={isPending}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="primary"
              checked={isPrimary}
              onCheckedChange={setIsPrimary}
              disabled={isPending}
            />
            <Label htmlFor="primary">
              {!hasPrimaryImage 
                ? "Set as primary image (first image will be primary by default)" 
                : "Set as primary image"}
            </Label>
          </div>
          
          <Button
            type="button"
            variant="default"
            className="w-full bg-greentrail-600 hover:bg-greentrail-700"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {isPending ? 'Uploading...' : 'Upload Image'}
          </Button>
        </>
      )}
    </div>
  );
};

export default TrailImageUpload;
