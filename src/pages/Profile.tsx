
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSocialDisplay from '@/components/profile/ProfileSocialDisplay';
import { ProfileBadges } from '@/components/profile/ProfileBadges';
import { ProfileStatsCard } from '@/components/profile/ProfileStatsCard';
import { useBadges } from '@/hooks/use-badges';
import { MapPin, Calendar, Award, Trophy } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading: loadingProfile } = useProfile(user?.id);
  const { badges, loading: loadingBadges } = useBadges();
  
  const stats = [
    { 
      value: '12', 
      label: 'Trails Hiked',
      icon: <Trophy size={16} className="text-greentrail-600" /> 
    },
    { 
      value: '134', 
      label: 'Miles',
      icon: <MapPin size={16} className="text-greentrail-600" />
    },
    { 
      value: '7', 
      label: 'Day Streak',
      icon: <Calendar size={16} className="text-greentrail-600" />
    },
    { 
      value: badges.filter(b => b.unlocked).length, 
      label: 'Badges',
      icon: <Award size={16} className="text-greentrail-600" />
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="My Profile - GreenTrails"
        description="View and manage your GreenTrails profile, achievements, and hiking stats."
        type="profile"
      />
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 lg:py-8">
        {user && (
          <ProfileHeader 
            userId={user.id}
            username={userProfile?.username || 'trail_explorer'}
            fullName={userProfile?.full_name || 'Trail Explorer'}
            bio={userProfile?.bio || 'Passionate hiker exploring nature one trail at a time 🥾🏔️'}
            location="Pacific Northwest"
            joinDate={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'January 2024'}
            followersCount={1247}
            followingCount={389}
            trailsCompleted={127}
            badges={[]}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileStatsCard stats={stats} loading={loadingBadges} />
            
            {user && <ProfileSocialDisplay userId={user.id} />}
          </div>
          
          <div>
            <ProfileBadges badges={badges} loading={loadingBadges} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
