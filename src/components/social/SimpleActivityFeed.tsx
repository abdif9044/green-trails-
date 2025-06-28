
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimpleActivityFeed: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Feed</h2>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Activity Feed Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Social features are being restored. Check back soon to see trail adventures from other hikers!
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link to="/discover">
                <MapPin className="h-4 w-4 mr-2" />
                Discover Trails
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/community">View Leaderboards</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleActivityFeed;
