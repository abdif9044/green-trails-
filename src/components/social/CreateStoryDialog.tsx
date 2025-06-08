
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, MapPin, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/use-geolocation';

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { location, error: locationError, getCurrentLocation } = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationCapture = async () => {
    try {
      await getCurrentLocation();
      if (location) {
        // In a real app, you'd reverse geocode the coordinates to get a place name
        setLocationName(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      }
    } catch (error) {
      toast({
        title: "Location access denied",
        description: "Please enable location services to add your location",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!selectedFile) {
      toast({
        title: "No media selected",
        description: "Please select a photo or video to share",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Here you would upload the file and create the story
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Story shared!",
        description: "Your story has been shared with your followers",
      });
      
      // Reset form
      setSelectedFile(null);
      setPreview('');
      setCaption('');
      setLocationName('');
      onOpenChange(false);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error sharing your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Trail Moment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                  <Camera className="h-8 w-8 text-gray-400" />
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add photo or video</p>
                  <p className="text-xs text-gray-500">Share your trail experience</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Caption */}
          <Textarea
            placeholder="What's happening on the trail?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            className="resize-none"
          />
          <div className="text-xs text-gray-500 text-right">
            {caption.length}/200
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLocationCapture}
                disabled={!!locationError}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Add Location
              </Button>
              {locationName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationName}
                  <button 
                    onClick={() => setLocationName('')}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
            
            {!locationName && (
              <Input
                placeholder="Enter location manually"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="text-sm"
              />
            )}
          </div>

          {/* Share Button */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              className="flex-1 bg-greentrail-600 hover:bg-greentrail-700"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Sharing...' : 'Share Story'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryDialog;
