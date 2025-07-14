import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/Loading';
import { 
  Mountain, 
  MapPin, 
  Star,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  length_miles: number;
  elevation_gain: number;
  rating: number;
  description: string;
  photos: string[];
  tags: string[];
}

const TrailsPage: React.FC = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('trails')
          .select('id, name, location, difficulty, length_miles, elevation_gain, rating, description, photos, tags')
          .eq('status', 'approved')
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(20);

        if (error) throw error;
        setTrails(data || []);
      } catch (err) {
        console.error('Error fetching trails:', err);
        setError('Failed to load trails. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrails();
  }, []);

  const filteredTrails = trails.filter(trail =>
    trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trail.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading message="Loading trails..." size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover Trails
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore {trails.length.toLocaleString()}+ verified hiking trails
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search trails by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Difficulties
          </Button>
          <Button variant="outline" size="sm">
            <Mountain className="h-4 w-4 mr-2" />
            Length
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trail Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrails.map((trail) => (
            <Card key={trail.id} className="border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{trail.name}</CardTitle>
                  {trail.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{trail.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {trail.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {trail.difficulty && (
                      <Badge variant={
                        trail.difficulty === 'easy' ? 'secondary' :
                        trail.difficulty === 'moderate' ? 'default' : 'destructive'
                      }>
                        {trail.difficulty}
                      </Badge>
                    )}
                    {trail.length_miles && (
                      <Badge variant="outline">
                        {trail.length_miles} mi
                      </Badge>
                    )}
                    {trail.elevation_gain && (
                      <Badge variant="outline">
                        {trail.elevation_gain}ft gain
                      </Badge>
                    )}
                  </div>
                  
                  {trail.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {trail.description}
                    </p>
                  )}

                  {trail.tags && trail.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {trail.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrails.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No trails found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailsPage;