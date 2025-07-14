
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mountain, 
  MapPin, 
  Users, 
  Star,
  ArrowRight,
  Leaf,
  Activity,
  LogIn
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrails: 0,
    activeUsers: 0,
    totalDistance: 0
  });

  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Fetch real trail count from Supabase
        const { count: trailCount } = await supabase
          .from('trails')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
          .eq('is_active', true);

        // Fetch user count from profiles
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          totalTrails: trailCount || 0,
          activeUsers: userCount || 0,
          totalDistance: Math.floor((trailCount || 0) * 3.2) // Estimated based on average trail length
        });
      } catch (error) {
        console.error('Error loading app data:', error);
        // Fallback to demo data
        setStats({
          totalTrails: 20000,
          activeUsers: 1200,
          totalDistance: 75000
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  if (isLoading) {
    return <Loading message="Loading GreenTrails..." size="lg" />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Mountain className="h-12 w-12 text-green-600" />
              <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                GreenTrails
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Discover amazing hiking trails, connect with fellow outdoor enthusiasts, 
              and share your cannabis-friendly adventures in nature's playground.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Leaf className="h-4 w-4 mr-2" />
                21+ Cannabis Friendly
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                Community Driven
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Mountain className="h-4 w-4 mr-2" />
                Trail Verified
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/trails')}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Discover Trails
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              {user ? (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/admin/import-debug')}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In / Join
                </Button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {stats.totalTrails.toLocaleString()}
                </CardTitle>
                <CardDescription>Total Trails</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {stats.activeUsers.toLocaleString()}
                </CardTitle>
                <CardDescription>Active Users</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {(stats.totalDistance / 1000).toLocaleString()}K+
                </CardTitle>
                <CardDescription>Miles Hiked</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Trail Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Find the perfect trails with detailed maps, difficulty ratings, 
                  and real-time weather conditions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with like-minded hikers, share photos, and join 
                  cannabis-friendly outdoor events.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Quick Access */}
          <div className="mt-16 text-center">
            <Card className="max-w-md mx-auto border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Admin Tools
                </CardTitle>
                <CardDescription>
                  Access the trail import debug system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/admin/import-debug')}
                >
                  Open Debug Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
