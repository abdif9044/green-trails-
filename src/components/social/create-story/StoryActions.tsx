
import React from 'react';
import { Button } from '@/components/ui/button';

interface StoryActionsProps {
  onCancel: () => void;
  onShare: () => void;
  isUploading: boolean;
  hasSelectedFile: boolean;
}

const StoryActions: React.FC<StoryActionsProps> = ({ 
  onCancel, 
  onShare, 
  isUploading, 
  hasSelectedFile 
}) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="flex-1"
        disabled={isUploading}
      >
        Cancel
      </Button>
      <Button 
        onClick={onShare}
        className="flex-1 bg-greentrail-600 hover:bg-greentrail-700"
        disabled={!hasSelectedFile || isUploading}
      >
        {isUploading ? 'Sharing...' : 'Share Story'}
      </Button>
    </div>
  );
};

export default StoryActions;
