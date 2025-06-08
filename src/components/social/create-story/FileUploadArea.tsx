
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileSelect, fileInputRef }) => {
  return (
    <>
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
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={onFileSelect}
        className="hidden"
      />
    </>
  );
};

export default FileUploadArea;
