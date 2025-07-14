import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Settings,
  Shield,
  Leaf
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  website_url: string | null;
  year_of_birth: number | null;
  is_age_verified: boolean | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    website_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        username: data.username || '',
        bio: data.bio || '',
        website_url: data.website_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          username: formData.username || null,
          bio: formData.bio || null,
          website_url: formData.website_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        website_url: profile.website_url || '',
      });
    }
  };

  if (isLoading) {
    return <Loading message="Loading profile..." size="lg" />;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                User Profile
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage your account information and preferences
              </p>
            </div>

            {/* Profile Card */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Profile Information
                  </CardTitle>
                  {!isEditing && (
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </Label>
                    <Input 
                      value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''} 
                      disabled 
                    />
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div>
                  <Label htmlFor="website_url">Website</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Age Verification Status */}
                <div className="flex items-center gap-4">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Age Verification
                  </Label>
                  <Badge variant={profile?.is_age_verified ? "default" : "secondary"}>
                    {profile?.is_age_verified ? (
                      <>
                        <Leaf className="h-3 w-3 mr-1" />
                        Verified 21+
                      </>
                    ) : (
                      'Not Verified'
                    )}
                  </Badge>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Your hiking activity on GreenTrails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Trails Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Photos Shared</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Reviews Written</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;