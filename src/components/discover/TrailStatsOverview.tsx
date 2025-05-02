
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Compass, Mountain, Map, Route } from 'lucide-react';

type TrailStats = {
  totalTrails: number;
  countries: { name: string; count: number }[];
  difficulties: { type: string; count: number }[];
  topStates: { name: string; count: number }[];
};

export const TrailStatsOverview: React.FC = () => {
  const [stats, setStats] = useState<TrailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total trail count
        const { count: totalTrails, error: countError } = await supabase
          .from('trails')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Get country distribution
        const { data: countryData, error: countryError } = await supabase
          .from('trails')
          .select('country')
          .not('country', 'is', null);
          
        if (countryError) throw countryError;
        
        // Get difficulty distribution
        const { data: difficultyData, error: difficultyError } = await supabase
          .from('trails')
          .select('difficulty')
          .not('difficulty', 'is', null);
          
        if (difficultyError) throw difficultyError;
        
        // Get top states/provinces
        const { data: stateData, error: stateError } = await supabase
          .from('trails')
          .select('state_province')
          .not('state_province', 'is', null);
          
        if (stateError) throw stateError;
        
        // Process country data
        const countryCount: Record<string, number> = {};
        countryData.forEach(item => {
          const country = item.country || 'Unknown';
          countryCount[country] = (countryCount[country] || 0) + 1;
        });
        
        const countries = Object.entries(countryCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        // Process difficulty data
        const difficultyCount: Record<string, number> = {};
        difficultyData.forEach(item => {
          const difficulty = item.difficulty || 'unknown';
          difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
        });
        
        const difficulties = Object.entries(difficultyCount)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);
          
        // Process state/province data
        const stateCount: Record<string, number> = {};
        stateData.forEach(item => {
          const state = item.state_province || 'Unknown';
          stateCount[state] = (stateCount[state] || 0) + 1;
        });
        
        const topStates = Object.entries(stateCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        setStats({
          totalTrails: totalTrails || 0,
          countries,
          difficulties,
          topStates
        });
      } catch (error) {
        console.error('Error fetching trail stats:', error);
        setError('Failed to load trail statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Map className="mr-2 h-5 w-5 text-greentrail-600" />
            Loading Trail Statistics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-28 flex items-center justify-center">
            <div className="w-6 h-6 border-t-2 border-greentrail-600 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-red-600">
            <Map className="mr-2 h-5 w-5" />
            Error Loading Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Map className="mr-2 h-5 w-5 text-greentrail-600" />
          Trail Database Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Trails</span>
              <span className="text-2xl font-bold text-greentrail-700">{formatNumber(stats.totalTrails)}</span>
            </div>
            
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">Difficulty Breakdown</div>
              {stats.difficulties.map((diff, idx) => (
                <div key={diff.type} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{diff.type}</span>
                    <span>{Math.round(diff.count / stats.totalTrails * 100)}%</span>
                  </div>
                  <Progress 
                    value={diff.count / stats.totalTrails * 100} 
                    className="h-1.5" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Top Countries</div>
            <div className="space-y-2">
              {stats.countries.map((country, idx) => (
                <div key={country.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Compass className="h-4 w-4 mr-2 text-greentrail-600" />
                    <span>{country.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatNumber(country.count)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Top Regions</div>
            <div className="space-y-2">
              {stats.topStates.map((state, idx) => (
                <div key={state.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Route className="h-4 w-4 mr-2 text-greentrail-600" />
                    <span>{state.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatNumber(state.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
