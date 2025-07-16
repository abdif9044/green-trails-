
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, MapPin, TrendingUp, Users } from 'lucide-react';
import { useTrailStatistics } from '@/services/trails';

interface TrailStatsOverviewProps {
  count?: number;
}

export const TrailStatsOverview: React.FC<TrailStatsOverviewProps> = ({ count }) => {
  const { data: stats, isLoading, error } = useTrailStatistics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trail Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Error loading trail statistics:', error);
  }

  const displayCount = count || stats?.active_trails || 0;
  const totalTrails = stats?.total_trails || 0;
  const averageLength = stats?.average_length || 0;
  const difficultyStats = stats?.trails_by_difficulty || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trail Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-greentrail-600" />
            <span className="text-sm text-gray-600">
              {displayCount.toLocaleString()} active trails
            </span>
          </div>
          
          {totalTrails > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-greentrail-600" />
              <span className="text-sm text-gray-600">
                {totalTrails.toLocaleString()} total trails in database
              </span>
            </div>
          )}
          
          {averageLength > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-greentrail-600" />
              <span className="text-sm text-gray-600">
                {averageLength} miles average length
              </span>
            </div>
          )}

          {Object.keys(difficultyStats).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">By Difficulty:</h4>
              <div className="space-y-1">
                {Object.entries(difficultyStats).map(([difficulty, count]) => (
                  <div key={difficulty} className="flex justify-between text-xs">
                    <span className="capitalize">{difficulty}:</span>
                    <span>{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
