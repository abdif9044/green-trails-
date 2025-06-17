
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MapPin, Upload, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useCreateAlbum } from '@/hooks/use-create-album';

interface AlbumFormProps {
  className?: string;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createAlbumMutation = useCreateAlbum();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
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
  
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setUseLocation(true);
        
        // Try to get location name from coordinates using reverse geocoding
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoiZ3JlZW50cmFpbHMtdGVzdCIsImEiOiJjbDBjZXlmYWMwMDQxM2RydDJ1bm1zYmVqIn0.OnS8ThN47ArmXCkV2NBa9A`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              setLocation(data.features[0].place_name);
            }
          })
          .catch(err => {
            console.error('Error getting location name:', err);
          });
      },
      (error) => {
        toast({
          title: 'Error',
          description: `Unable to retrieve your location: ${error.message}`,
          variant: 'destructive',
        });
      }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const albumData = {
      title,
      description,
      location,
      is_private: isPrivate,
    };

    const mediaFiles = files.map(file => ({ file }));

    createAlbumMutation.mutate({ albumData, mediaFiles });
  };

  // UI rendering
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Album</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title field */}
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
          
          {/* Description field */}
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
          
          {/* Location field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={getLocation}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Current
              </Button>
            </div>
          </div>
          
          {/* Photos/Videos upload */}
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
          
          {/* Privacy toggle & action buttons */}
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
                disabled={createAlbumMutation.isPending || !title || files.length === 0}
              >
                {createAlbumMutation.isPending ? 'Creating...' : 'Create Album'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlbumForm;
