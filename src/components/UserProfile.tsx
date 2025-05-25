
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  is_age_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch exception:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: Partial<Profile>) => {
    if (!user || !profile) return;

    setSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        setProfile({ ...profile, ...updatedData });
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      username: formData.get('username') as string,
      full_name: formData.get('full_name') as string,
      bio: formData.get('bio') as string,
      website_url: formData.get('website_url') as string,
    };

    handleUpdate(updates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your GreenTrails profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input
              id="username"
              name="username"
              type="text"
              defaultValue={profile.username || ''}
              placeholder="Choose a username"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile.full_name || ''}
              placeholder="Your full name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio || ''}
              placeholder="Tell others about yourself and your hiking interests..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="website_url" className="text-sm font-medium">Website</label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              defaultValue={profile.website_url || ''}
              placeholder="Your website URL"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
