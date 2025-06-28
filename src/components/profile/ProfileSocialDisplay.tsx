
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileSocialDisplayProps {
  userId?: string;
}

const ProfileSocialDisplay: React.FC<ProfileSocialDisplayProps> = ({ userId }) => {
  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Sign in to see your social activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Social Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">Social features are being restored. Check back soon!</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Following</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <div>
              <p className="text-sm font-medium">Followers</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSocialDisplay;
