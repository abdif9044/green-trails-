
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/hooks/use-auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { Separator } from '@/components/ui/separator';
import { Album } from 'lucide-react';
import AlbumCard from '@/components/social/AlbumCard';
import { useAlbums } from '@/hooks/use-albums';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // If no userId is provided in URL, default to current user
  const targetUserId = userId || user?.id;
  
  // Check if this is the current user's profile
  const isCurrentUser = user?.id === targetUserId;
  
  // Fetch profile data
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError
  } = useProfile(targetUserId);
  
  // Fetch user albums
  const {
    data: albums,
    isLoading: isAlbumsLoading
  } = useAlbums(targetUserId);
  
  if (isProfileError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-4">
              {profileError instanceof Error ? profileError.message : 'Failed to load profile data'}
            </p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <ProfileHeader
            profile={profile}
            isLoading={isProfileLoading}
            isCurrentUser={isCurrentUser}
            onEditProfile={() => setShowEditProfile(true)}
          />
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="albums" className="w-full">
          <TabsList>
            <TabsTrigger value="albums" className="flex items-center gap-1">
              <Album className="h-4 w-4" />
              Albums
            </TabsTrigger>
            <TabsTrigger value="liked">Liked Trails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="albums" className="mt-6">
            {albums && albums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : isAlbumsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading albums...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Albums Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {isCurrentUser ? 'You haven\'t created any albums yet.' : 'This user hasn\'t created any albums yet.'}
                </p>
                {isCurrentUser && (
                  <Button onClick={() => navigate('/albums/new')}>
                    Create Your First Album
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Liked trails will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {profile && showEditProfile && (
        <ProfileEditForm
          profile={profile}
          open={showEditProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Profile;
