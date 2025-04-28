
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from 'lucide-react';
import { useUploadTrailImage } from '@/hooks/use-trail-images';

interface TrailImageUploadProps {
  trailId: string;
  onSuccess?: () => void;
}

const TrailImageUpload = ({ trailId, onSuccess }: TrailImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const { mutate: uploadImage, isLoading } = useUploadTrailImage(trailId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadImage(
      { file, caption, isPrimary },
      {
        onSuccess: () => {
          setCaption('');
          setIsPrimary(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="image">Trail Image</Label>
        <Input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption (optional)</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption to your image..."
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="primary"
          checked={isPrimary}
          onCheckedChange={setIsPrimary}
          disabled={isLoading}
        />
        <Label htmlFor="primary">Set as primary image</Label>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Camera className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
};

export default TrailImageUpload;
