
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import DiscoverTrailsList from '@/components/discover/DiscoverTrailsList';
import DiscoverViewControls from '@/components/discover/DiscoverViewControls';
import { TrailStatsOverview } from '@/components/discover/TrailStatsOverview';
import { TrailFilters } from '@/types/trails';
import SEOProvider from "@/components/SEOProvider";

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewType, setViewType] = useState<'grid' | 'map'>(
    searchParams.get('view') === 'map' ? 'map' : 'grid'
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
    
    setSearchParams(params);
  };

  const handleViewChange = (view: 'grid' | 'map') => {
    setViewType(view);
    
    const params = new URLSearchParams(searchParams);
    if (view === 'map') {
      params.set('view', 'map');
    } else {
      params.delete('view');
    }
    
    setSearchParams(params);
  };
  
  const updateTrailCount = (count: number) => {
    setTrailCount(count);
  };

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
            <div className="w-full lg:w-64 shrink-0">
              <DiscoverFilters 
                currentFilters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
            
            <div className="flex-grow">
              <DiscoverViewControls 
                viewMode={viewType} 
                onViewModeChange={handleViewChange}
              />
              
              <DiscoverTrailsList 
                currentFilters={filters} 
                viewMode={viewType}
                onTrailCountChange={updateTrailCount}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
