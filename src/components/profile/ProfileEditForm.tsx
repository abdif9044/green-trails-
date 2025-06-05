
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/use-profile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ProfileWithSocial } from '@/types/profiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileEditFormProps {
  profile: ProfileWithSocial;
  onClose: () => void;
  open: boolean;
  onSave?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onClose, open, onSave }) => {
  const [username, setUsername] = useState(profile.username || '');
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const updateProfileMutation = useUpdateProfile();
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    
    // Removed file size validation to allow any size photo
    
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
    setError(null);
  };
  
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return profile.avatar_url;
    
    try {
      setUploadingAvatar(true);
      
      // Ensure user-uploads bucket exists and is accessible
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
      }
      
      const userUploadsBucket = buckets?.find(bucket => bucket.name === 'user-uploads');
      
      if (!userUploadsBucket) {
        // Try to create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('user-uploads', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: null // No size limit
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw new Error('Failed to create storage bucket');
        }
      }
      
      // Create a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${profile.id}/${fileName}`;
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload avatar. Please try again.');
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are valid (not required)
    
    try {
      // Check if it has a protocol, if not add https://
      const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate username (alphanumeric and underscores only)
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username can only contain letters, numbers, and underscores.');
        return;
      }

      // Validate URLs
      if (websiteUrl && !validateUrl(websiteUrl)) {
        setError('Please enter a valid website URL.');
        return;
      }
      
      // Format URLs with protocol if needed
      const formattedWebsiteUrl = websiteUrl ? 
        (websiteUrl.match(/^https?:\/\//) ? websiteUrl : `https://${websiteUrl}`) : 
        null;
      
      // Upload avatar if changed
      let newAvatarUrl = profile.avatar_url;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar();
        if (!newAvatarUrl) return; // Upload failed
      }
      
      // Update profile
      await updateProfileMutation.mutateAsync({
        username,
        full_name: fullName,
        bio,
        avatar_url: newAvatarUrl,
        website_url: formattedWebsiteUrl
      });
      
      // Call onSave if provided
      if (onSave) {
        onSave();
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback className="bg-greentrail-600 text-white">
                    {username?.substring(0, 2).toUpperCase() || 'GT'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center gap-2">
                  <Label 
                    htmlFor="avatar-upload" 
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Upload className="h-4 w-4" />
                    Change Avatar
                  </Label>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  placeholder="Your unique username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  placeholder="Your display name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] resize-y"
                  maxLength={500}
                  placeholder="Tell others about yourself"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" /> Website
                </Label>
                <Input
                  id="website"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
                <p className="text-xs text-muted-foreground">
                  Share your personal website or blog
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending || uploadingAvatar}
              className="bg-greentrail-600 hover:bg-greentrail-700"
            >
              {(updateProfileMutation.isPending || uploadingAvatar) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
