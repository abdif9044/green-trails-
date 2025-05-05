
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import SignInRequired from '@/components/social/SignInRequired';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <SignInRequired />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />
      <ProfileEditForm />
    </div>
  );
};

export default ProfilePage;
