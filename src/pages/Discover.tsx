
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscoverHeader from "@/components/discover/DiscoverHeader";
import DiscoverFilters from "@/components/discover/DiscoverFilters";
import DiscoverTrailsList from "@/features/discover/components/DiscoverTrailsList";
import DiscoverViewControls from "@/features/discover/components/DiscoverViewControls";
import { TrailStatsOverview } from "@/components/discover/TrailStatsOverview";
import TrailMap from "@/features/map/components/TrailMap";
import SEOProvider from "@/components/SEOProvider";
import { useTrailsQuery } from "@/features/trails/hooks/use-trails-query";
import { useSearchParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { useEasterEggs } from '@/contexts/easter-eggs-context';
import { SecretTrailsList } from '@/components/easter-eggs/SecretTrailCard';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    length: '',
    rating: '',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showTrailPaths, setShowTrailPaths] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [searchParams, setSearchParams] = useSearchParams();
  const { secretTrailsUnlocked } = useEasterEggs();

  const trailFilters = {
    searchQuery,
    country: undefined,
    stateProvince: undefined,
    difficulty: filters.difficulty || undefined,
  };

  const { data, isLoading, error, refetch } = useTrailsQuery(trailFilters);
  const isError = !!error;
  const trails = data?.data || [];
  const totalCount = data?.count || 0;

  useEffect(() => {
    // Read initial values from URL params
    const initialSearch = searchParams.get('search') || '';
    const initialLocation = searchParams.get('location') || '';
    const initialDifficulty = searchParams.get('difficulty') || '';
    const initialLength = searchParams.get('length') || '';
    const initialRating = searchParams.get('rating') || '';
    const initialSort = searchParams.get('sort') || 'popular';
    const initialViewMode = (searchParams.get('view') === 'map' ? 'map' : 'list') as 'list' | 'map';
    const initialShowPaths = searchParams.get('paths') === 'true';

    setSearchQuery(initialSearch);
    setLocationFilter(initialLocation);
    setFilters({
      difficulty: initialDifficulty,
      length: initialLength,
      rating: initialRating,
    });
    setSortBy(initialSort);
    setViewMode(initialViewMode);
    setShowTrailPaths(initialShowPaths);
  }, [searchParams]);

  const updateURLParams = useCallback(() => {
    // Update URL params based on current state
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationFilter) params.set('location', locationFilter);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.length) params.set('length', filters.length);
    if (filters.rating) params.set('rating', filters.rating);
    if (sortBy) params.set('sort', sortBy);
    if (viewMode === 'map') params.set('view', 'map');
    if (showTrailPaths) params.set('paths', 'true');

    setSearchParams(params);
  }, [searchQuery, locationFilter, filters, sortBy, viewMode, showTrailPaths, setSearchParams]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  const handleResetFilters = () => {
    setFilters({
      difficulty: '',
      length: '',
      rating: '',
    });
    setSearchQuery('');
    setLocationFilter('');
    setSortBy('popular');
    setViewMode('list');
    setShowTrailPaths(false);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-greentrail-50 dark:bg-greentrail-950">
      <SEOProvider
        title="Discover Trails - GreenTrails"
        description="Discover amazing hiking trails, from easy walks to challenging mountain climbs. Filter by difficulty, location, and more to find your perfect outdoor adventure."
        type="website"
      />
      
      <Navbar />
      
      <DiscoverHeader 
        trailCount={totalCount}
        totalTrails={totalCount}
      />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="space-y-6">
          <DiscoverFilters
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
          />

          {/* Secret Trails Section */}
          {secretTrailsUnlocked && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                  🔮 Secret Trails
                </h2>
                <Badge className="bg-purple-500 text-white">
                  Unlocked!
                </Badge>
              </div>
              <p className="text-muted-foreground">
                These mysterious trails are only visible to true explorers who've discovered the hidden secrets of GreenTrails...
              </p>
              <SecretTrailsList />
              <hr className="border-greentrail-200 dark:border-greentrail-800" />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <TrailStatsOverview
                count={totalCount}
              />
            </div>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Trails'}
                </h1>
                
                <DiscoverViewControls
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  showTrailPaths={showTrailPaths}
                  onToggleTrailPaths={() => setShowTrailPaths(!showTrailPaths)}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>

              {viewMode === 'list' ? (
                <DiscoverTrailsList
                  viewMode={viewMode}
                  showTrailPaths={showTrailPaths}
                  onTrailCountChange={() => {}}
                />
              ) : (
                <TrailMap
                  trails={trails}
                  showTrailPaths={showTrailPaths}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
