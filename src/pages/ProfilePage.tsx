
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import SignInRequired from '@/components/social/SignInRequired';

const ProfilePage = () => {
  const { user } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate profile loading for now (would be replaced with real data fetching)
  React.useEffect(() => {
    if (user) {
      // Simulate loading profile data
      setTimeout(() => {
        setProfile({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: '',
          bio: '',
          avatar_url: null,
          is_age_verified: false,
          website_url: null
        });
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return <SignInRequired />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        profile={profile} 
        isLoading={isLoading} 
        isCurrentUser={true}
        onEditProfile={() => setShowEditProfile(true)}
      />
      {profile && showEditProfile && (
        <ProfileEditForm 
          profile={profile}
          open={showEditProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
