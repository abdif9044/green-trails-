
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  total_distance: number;
  total_elevation: number;
  total_trails: number;
  current_streak: number;
  profiles: {
    full_name: string;
    avatar_url: string;
    username: string;
  } | null;
}

const Leaderboards: React.FC = () => {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            username
          )
        `)
        .order('total_distance', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      return (data || []).map((entry, index) => ({
        rank: index + 1,
        user_id: entry.user_id || '',
        total_distance: entry.total_distance || 0,
        total_elevation: entry.total_elevation || 0,
        total_trails: entry.total_trails || 0,
        current_streak: entry.current_streak || 0,
        profiles: Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles
      }));
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div key={entry.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {entry.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{entry.profiles?.full_name || 'Unknown User'}</p>
                  <p className="text-sm text-muted-foreground">
                    @{entry.profiles?.username || 'unknown'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{entry.total_distance.toFixed(1)} mi</p>
                <p className="text-sm text-muted-foreground">{entry.total_trails} trails</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboards;
