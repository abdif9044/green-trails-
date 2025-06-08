
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import FileUploadArea from './create-story/FileUploadArea';
import StoryPreview from './create-story/StoryPreview';
import CaptionInput from './create-story/CaptionInput';
import LocationInput from './create-story/LocationInput';
import StoryActions from './create-story/StoryActions';

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
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
            <FileUploadArea 
              onFileSelect={handleFileSelect}
              fileInputRef={fileInputRef}
            />
          ) : (
            <StoryPreview 
              preview={preview}
              onClear={clearFile}
            />
          )}

          {/* Caption */}
          <CaptionInput 
            caption={caption}
            setCaption={setCaption}
          />

          {/* Location */}
          <LocationInput 
            locationName={locationName}
            setLocationName={setLocationName}
          />

          {/* Share Button */}
          <StoryActions 
            onCancel={() => onOpenChange(false)}
            onShare={handleShare}
            isUploading={isUploading}
            hasSelectedFile={!!selectedFile}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryDialog;
