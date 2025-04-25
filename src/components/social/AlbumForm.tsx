
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MapPin, Upload, X, Image, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

interface AlbumFormProps {
  className?: string;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to create an album.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your album.',
        variant: 'destructive',
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one photo or video to your album.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create album
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .insert({
          title,
          description,
          location,
          is_private: isPrivate,
          user_id: user.id,
          // Add coordinates if using location
          ...(useLocation && userLocation ? {
            coordinates: `POINT(${userLocation.lng} ${userLocation.lat})`
          } : {})
        })
        .select()
        .single();
      
      if (albumError) throw albumError;
      
      // Upload files
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Add to media table
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            album_id: album.id,
            user_id: user.id,
            file_path: filePath,
            file_type: file.type,
            caption: ''
          });
        
        if (mediaError) throw mediaError;
      }
      
      toast({
        title: 'Album Created',
        description: 'Your album has been created successfully.',
      });
      
      // Navigate to social page
      navigate('/social');
      
    } catch (error: any) {
      console.error('Error creating album:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Album</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={isSubmitting || !title || files.length === 0}
              >
                {isSubmitting ? 'Creating...' : 'Create Album'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlbumForm;
