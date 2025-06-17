
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

const MediaUpload = ({ files, setFiles, previews, setPreviews }: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: 'Invalid Files',
        description: 'Only image and video files are allowed.',
        variant: 'destructive',
      });
    }
    
    if (validFiles.length === 0) return;
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Photos/Videos</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-greentrail-200 dark:border-greentrail-800">
            {files[index]?.type.startsWith('image/') ? (
              <img 
                src={preview} 
                alt={`Selected file ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center bg-greentrail-100 dark:bg-greentrail-800 h-full">
                <Camera className="h-8 w-8 text-greentrail-500" />
              </div>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-1 rounded-full"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-md border-2 border-dashed border-greentrail-200 dark:border-greentrail-700 flex flex-col items-center justify-center gap-1 hover:bg-greentrail-50 dark:hover:bg-greentrail-900 transition-colors"
        >
          <Upload className="h-6 w-6 text-greentrail-500" />
          <span className="text-sm text-greentrail-500">Add</span>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,video/*" 
            multiple 
            className="hidden"
            onChange={handleFileSelect}
          />
        </button>
      </div>
    </div>
  );
};

export default MediaUpload;
