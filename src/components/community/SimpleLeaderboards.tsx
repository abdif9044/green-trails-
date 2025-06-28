
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Mountain, MapPin, Calendar } from 'lucide-react';

// Temporary simplified leaderboards component until database types are updated
const SimpleLeaderboards: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Community Leaderboards</h1>
        <p className="text-gray-600">Coming soon - see how you stack up against other adventurers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mountain className="h-5 w-5 text-green-600" />
              Trails Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Most trails hiked</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Coming Soon
                </span>
                <span className="font-bold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Longest combined distance</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Coming Soon
                </span>
                <span className="font-bold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mountain className="h-5 w-5 text-purple-600" />
              Elevation Gained
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Highest elevation climbed</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Coming Soon
                </span>
                <span className="font-bold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Consecutive hiking days</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Coming Soon
                </span>
                <span className="font-bold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Start Your Hiking Journey</h3>
            <p className="text-gray-600 text-sm mb-4">
              Complete your first trail to start appearing on the leaderboards and compete with other adventurers!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLeaderboards;
