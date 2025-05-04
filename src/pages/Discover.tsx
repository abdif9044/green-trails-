
import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import DiscoverTrailsList from '@/components/discover/DiscoverTrailsList';
import DiscoverViewControls from '@/components/discover/DiscoverViewControls';
import { TrailStatsOverview } from '@/components/discover/TrailStatsOverview';
import { TrailFilters } from '@/types/trails';
import SEOProvider from "@/components/SEOProvider";
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [viewType, setViewType] = useState<'list' | 'map'>(
    searchParams.get('view') === 'map' ? 'map' : 'list'
  );
  const [showTrailPaths, setShowTrailPaths] = useState<boolean>(
    searchParams.get('paths') === 'true'
  );
  const [trailCount, setTrailCount] = useState<number>(0);

  // Handle filters from URL params or set defaults
  const initialFilters: TrailFilters = {
    searchQuery: searchParams.get('q') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    lengthRange: searchParams.get('length') 
      ? searchParams.get('length')!.split('-').map(Number) as [number, number]
      : undefined,
    tags: searchParams.get('tags')
      ? searchParams.get('tags')!.split(',')
      : undefined,
    country: searchParams.get('country') || undefined,
    stateProvince: searchParams.get('state') || undefined,
    showAgeRestricted: searchParams.get('age_restricted') === 'true'
  };

  const [filters, setFilters] = useState<TrailFilters>(initialFilters);

  const handleFilterChange = (newFilters: TrailFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.difficulty) params.set('difficulty', newFilters.difficulty);
    if (newFilters.lengthRange) params.set('length', newFilters.lengthRange.join('-'));
    if (newFilters.tags && newFilters.tags.length > 0) params.set('tags', newFilters.tags.join(','));
    if (newFilters.country) params.set('country', newFilters.country);
    if (newFilters.stateProvince) params.set('state', newFilters.stateProvince);
    if (newFilters.showAgeRestricted) params.set('age_restricted', 'true');
    if (viewType === 'map') params.set('view', 'map');
    if (showTrailPaths) params.set('paths', 'true');
    
    setSearchParams(params);
  };

  const handleViewChange = (view: 'list' | 'map') => {
    setViewType(view);
    
    const params = new URLSearchParams(searchParams);
    if (view === 'map') {
      params.set('view', 'map');
    } else {
      params.delete('view');
    }
    
    setSearchParams(params);

    // Show toast to confirm view change
    toast({
      title: `${view === 'list' ? 'List' : 'Map'} view activated`,
      duration: 2000,
    });
  };
  
  const handleToggleTrailPaths = () => {
    const newState = !showTrailPaths;
    setShowTrailPaths(newState);
    
    const params = new URLSearchParams(searchParams);
    if (newState) {
      params.set('paths', 'true');
    } else {
      params.delete('paths');
    }
    
    setSearchParams(params);
  };
  
  const updateTrailCount = (count: number) => {
    setTrailCount(count);
  };

  const handleTrailSelect = useCallback((trailId: string) => {
    navigate(`/trail/${trailId}`);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOProvider 
        title="Discover Trails - GreenTrails"
        description="Explore and discover trails for hiking, biking, and outdoor adventures"
      />
      
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-greentrail-950">
        <div className="container mx-auto px-4 py-8">
          <DiscoverHeader trailCount={trailCount} />
          
          <TrailStatsOverview />
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`${viewType === 'map' && !isMobile ? 'lg:w-64 shrink-0' : 'w-full'}`}>
              {isMobile || viewType === 'list' ? (
                <DiscoverFilters 
                  currentFilters={filters} 
                  onFilterChange={handleFilterChange} 
                />
              ) : (
                <div className="sticky top-20">
                  <DiscoverFilters 
                    currentFilters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <DiscoverViewControls 
                viewMode={viewType} 
                onViewModeChange={handleViewChange}
                showTrailPaths={showTrailPaths}
                onToggleTrailPaths={handleToggleTrailPaths}
              />
              
              <div className="mt-4">
                <DiscoverTrailsList 
                  currentFilters={filters} 
                  viewMode={viewType}
                  showTrailPaths={showTrailPaths}
                  onTrailCountChange={updateTrailCount}
                  onTrailSelect={handleTrailSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
