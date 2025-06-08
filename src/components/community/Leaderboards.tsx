import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Mountain, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface LeaderboardEntry {
  user_id: string;
  user: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
  total_trails: number;
  total_distance: number;
  total_elevation: number;
  current_streak: number;
  rank: number;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'distance' | 'trails' | 'elevation' | 'streak';
  target: number;
  start_date: string;
  end_date: string;
  participants: number;
  reward_badge: string;
}

const Leaderboards: React.FC = () => {
  const [leaderboards, setLeaderboards] = useState<{
    trails: LeaderboardEntry[];
    distance: LeaderboardEntry[];
    elevation: LeaderboardEntry[];
    streak: LeaderboardEntry[];
  }>({
    trails: [],
    distance: [],
    elevation: [],
    streak: []
  });
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRanks, setUserRanks] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      fetchLeaderboards(),
      fetchChallenges()
    ]).finally(() => setIsLoading(false));
  }, []);

  const fetchLeaderboards = async () => {
    try {
      // Fetch different leaderboard types
      const [trailsData, distanceData, elevationData, streakData] = await Promise.all([
        fetchLeaderboard('total_trails'),
        fetchLeaderboard('total_distance'),
        fetchLeaderboard('total_elevation'),
        fetchLeaderboard('current_streak')
      ]);

      setLeaderboards({
        trails: trailsData,
        distance: distanceData,
        elevation: elevationData,
        streak: streakData
      });

      // Set user ranks
      if (user) {
        setUserRanks({
          trails: trailsData.find(entry => entry.user_id === user.id)?.rank || 0,
          distance: distanceData.find(entry => entry.user_id === user.id)?.rank || 0,
          elevation: elevationData.find(entry => entry.user_id === user.id)?.rank || 0,
          streak: streakData.find(entry => entry.user_id === user.id)?.rank || 0
        });
      }
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    }
  };

  const fetchLeaderboard = async (orderBy: string): Promise<LeaderboardEntry[]> => {
    const { data, error } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        total_trails,
        total_distance,
        total_elevation,
        current_streak,
        profiles!user_stats_user_id_fkey(email, full_name, avatar_url)
      `)
      .order(orderBy, { ascending: false })
      .limit(50);

    if (error) throw error;

    return (data || []).map((entry, index) => {
      // Handle the case where profiles might be null or an array
      const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
      
      return {
        user_id: entry.user_id,
        total_trails: entry.total_trails,
        total_distance: entry.total_distance,
        total_elevation: entry.total_elevation,
        current_streak: entry.current_streak,
        user: {
          email: profile?.email || '',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url
        },
        rank: index + 1
      };
    });
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('community_challenges')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    if (rank <= 10) return 'bg-blue-500 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} mi`;
  };

  const formatElevation = (elevation: number) => {
    return `${elevation.toLocaleString()} ft`;
  };

  const LeaderboardTable = ({ entries, type }: { entries: LeaderboardEntry[], type: string }) => (
    <div className="space-y-2">
      {entries.map((entry) => {
        const userName = entry.user.full_name || entry.user.email.split('@')[0];
        const isCurrentUser = user?.id === entry.user_id;
        
        return (
          <div 
            key={entry.user_id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isCurrentUser ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Badge className={`${getRankBadgeColor(entry.rank)} min-w-[2rem] justify-center`}>
                {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
              </Badge>
            </div>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.user.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="font-medium text-sm">{userName}</p>
              {isCurrentUser && (
                <p className="text-xs text-green-600">You</p>
              )}
            </div>
            
            <div className="text-right">
              <p className="font-bold text-sm">
                {type === 'trails' && entry.total_trails}
                {type === 'distance' && formatDistance(entry.total_distance)}
                {type === 'elevation' && formatElevation(entry.total_elevation)}
                {type === 'streak' && `${entry.current_streak} days`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Community Leaderboards</h1>
        <p className="text-gray-600">See how you stack up against other adventurers</p>
      </div>

      {/* User's Ranks Summary */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">#{userRanks.trails || '--'}</p>
                <p className="text-sm text-gray-600">Trails Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">#{userRanks.distance || '--'}</p>
                <p className="text-sm text-gray-600">Total Distance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">#{userRanks.elevation || '--'}</p>
                <p className="text-sm text-gray-600">Elevation Gained</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">#{userRanks.streak || '--'}</p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="trails" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trails" className="flex items-center gap-1">
            <Mountain className="h-4 w-4" />
            Trails
          </TabsTrigger>
          <TabsTrigger value="distance" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Distance
          </TabsTrigger>
          <TabsTrigger value="elevation" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Elevation
          </TabsTrigger>
          <TabsTrigger value="streak" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Streak
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trails">
          <Card>
            <CardHeader>
              <CardTitle>Most Trails Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable entries={leaderboards.trails} type="trails" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distance">
          <Card>
            <CardHeader>
              <CardTitle>Longest Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable entries={leaderboards.distance} type="distance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elevation">
          <Card>
            <CardHeader>
              <CardTitle>Highest Total Elevation</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable entries={leaderboards.elevation} type="elevation" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streak">
          <Card>
            <CardHeader>
              <CardTitle>Longest Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardTable entries={leaderboards.streak} type="streak" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Community Challenges */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Active Community Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>{challenge.participants} participants</span>
                    <Badge variant="outline">{challenge.reward_badge}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Leaderboards;
