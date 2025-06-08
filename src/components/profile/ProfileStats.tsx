
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Trophy, Users } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    trailsHiked: number;
    totalMiles: number;
    dayStreak: number;
    followers: number;
    following: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  const statItems = [
    { 
      value: stats.trailsHiked, 
      label: 'Trails Hiked',
      icon: <Trophy className="h-4 w-4 text-greentrail-600" /> 
    },
    { 
      value: `${stats.totalMiles}mi`, 
      label: 'Total Distance',
      icon: <MapPin className="h-4 w-4 text-greentrail-600" />
    },
    { 
      value: stats.dayStreak, 
      label: 'Day Streak',
      icon: <Calendar className="h-4 w-4 text-greentrail-600" />
    },
    { 
      value: stats.followers, 
      label: 'Followers',
      icon: <Users className="h-4 w-4 text-greentrail-600" />
    },
    { 
      value: stats.following, 
      label: 'Following',
      icon: <Users className="h-4 w-4 text-greentrail-600" />
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
