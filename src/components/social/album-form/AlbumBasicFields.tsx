
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AlbumBasicFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const AlbumBasicFields = ({ title, setTitle, description, setDescription }: AlbumBasicFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Album Title</Label>
        <Input
          id="title"
          placeholder="Enter album title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Write a description for your album"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};

export default AlbumBasicFields;
