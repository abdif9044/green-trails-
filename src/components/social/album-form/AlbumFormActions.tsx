
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AlbumFormActionsProps {
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

const AlbumFormActions = ({ isPrivate, setIsPrivate, isSubmitting, canSubmit }: AlbumFormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Switch 
          id="private" 
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
        <Label htmlFor="private">Private Album</Label>
      </div>
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/social')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? 'Creating...' : 'Create Album'}
        </Button>
      </div>
    </div>
  );
};

export default AlbumFormActions;
