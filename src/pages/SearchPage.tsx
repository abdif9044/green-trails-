import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/Loading';
import { 
  Search,
  Mountain, 
  MapPin, 
  Star,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';

interface Trail {
  id: string;
  name: string;
  location: string;
  state: string;
  difficulty: string;
  length_miles: number;
  elevation_gain: number;
  rating: number;
  description: string;
  tags: string[];
}

interface SearchFilters {
  query: string;
  difficulty: string;
  state: string;
  lengthRange: [number, number];
  elevationRange: [number, number];
  minRating: number;
}

const SearchPage: React.FC = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    difficulty: '',
    state: '',
    lengthRange: [0, 50],
    elevationRange: [0, 10000],
    minRating: 0
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const { data, error } = await supabase
          .from('trails')
          .select('state')
          .not('state', 'is', null)
          .eq('status', 'approved');

        if (error) throw error;
        
        const uniqueStates = [...new Set(data.map(item => item.state))].filter(Boolean).sort();
        setStates(uniqueStates);
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };

    fetchStates();
  }, []);

  const searchTrails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('trails')
        .select('id, name, location, state, difficulty, length_miles, elevation_gain, rating, description, tags')
        .eq('status', 'approved')
        .eq('is_active', true);

      // Apply filters
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,location.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }
      
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty as any);
      }
      
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      
      if (filters.lengthRange[0] > 0 || filters.lengthRange[1] < 50) {
        query = query.gte('length_miles', filters.lengthRange[0]).lte('length_miles', filters.lengthRange[1]);
      }
      
      if (filters.elevationRange[0] > 0 || filters.elevationRange[1] < 10000) {
        query = query.gte('elevation_gain', filters.elevationRange[0]).lte('elevation_gain', filters.elevationRange[1]);
      }
      
      if (filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }

      const { data, error } = await query
        .order('rating', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTrails(data || []);
    } catch (err) {
      console.error('Error searching trails:', err);
      setError('Failed to search trails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      difficulty: '',
      state: '',
      lengthRange: [0, 50],
      elevationRange: [0, 10000],
      minRating: 0
    });
    setTrails([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Advanced Trail Search
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find the perfect trail with detailed filters
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any difficulty</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any state</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Length: {filters.lengthRange[0]} - {filters.lengthRange[1]} miles
                </label>
                <Slider
                  value={filters.lengthRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, lengthRange: value as [number, number] }))}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Elevation Gain: {filters.elevationRange[0]} - {filters.elevationRange[1]} ft
                </label>
                <Slider
                  value={filters.elevationRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, elevationRange: value as [number, number] }))}
                  max={10000}
                  step={100}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Rating: {filters.minRating > 0 ? filters.minRating : 'Any'}
              </label>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={searchTrails} disabled={isLoading} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search Trails'}
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading && <Loading message="Searching trails..." />}

        {trails.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Found {trails.length} trail{trails.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.map((trail) => (
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
                      {trail.location} {trail.state && `, ${trail.state}`}
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
                      
                      <Button className="w-full mt-4" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {trails.length === 0 && !isLoading && filters.query && (
          <div className="text-center py-12">
            <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No trails found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;