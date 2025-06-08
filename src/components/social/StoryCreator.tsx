
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Send } from 'lucide-react';

interface StoryCreatorProps {
  onStoryCreated?: () => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ onStoryCreated }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) {
      toast({
        title: "Content required",
        description: "Please add some text or an image to your story",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would upload the file and create the story
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Story shared!",
        description: "Your trail story has been shared with your followers"
      });
      
      // Reset form
      setContent('');
      setLocation('');
      setSelectedFile(null);
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onStoryCreated?.();
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your trail adventure..."
          rows={3}
        />

        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location..."
            className="flex-1"
          />
        </div>

        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Story preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              onClick={removeFile}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              Remove
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
          >
            <Send className="h-4 w-4 mr-1" />
            {isSubmitting ? "Sharing..." : "Share"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryCreator;
