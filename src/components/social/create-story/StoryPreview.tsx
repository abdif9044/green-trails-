
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StoryPreviewProps {
  preview: string;
  onClear: () => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ preview, onClear }) => {
  return (
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
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StoryPreview;
