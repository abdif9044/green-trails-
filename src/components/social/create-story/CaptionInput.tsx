
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CaptionInputProps {
  caption: string;
  setCaption: (caption: string) => void;
  maxLength?: number;
}

const CaptionInput: React.FC<CaptionInputProps> = ({ 
  caption, 
  setCaption, 
  maxLength = 200 
}) => {
  return (
    <>
      <Textarea
        placeholder="What's happening on the trail?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={maxLength}
        className="resize-none"
      />
      <div className="text-xs text-gray-500 text-right">
        {caption.length}/{maxLength}
      </div>
    </>
  );
};

export default CaptionInput;
