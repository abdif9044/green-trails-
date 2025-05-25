
import React, { useState } from 'react';
import { TrailFilters } from '@/types/trails';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import DiscoverTrailsList from '@/components/discover/DiscoverTrailsList';
import DiscoverViewControls from '@/components/discover/DiscoverViewControls';
import { TrailStatsOverview } from '@/components/discover/TrailStatsOverview';
import { Separator } from '@/components/ui/separator';

const Discover: React.FC = () => {
  const [currentFilters, setCurrentFilters] = useState<TrailFilters>({});
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showTrailPaths, setShowTrailPaths] = useState(false);
  const [trailCount, setTrailCount] = useState(0);

  const handleFiltersChange = (newFilters: TrailFilters) => {
    setCurrentFilters(newFilters);
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
  };

  const handleTrailCountChange = (count: number) => {
    setTrailCount(count);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <DiscoverHeader trailCount={trailCount} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <DiscoverFilters 
                onFiltersChange={handleFiltersChange}
                currentFilters={currentFilters}
              />
              
              <Separator />
              
              <TrailStatsOverview count={trailCount} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <DiscoverViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showTrailPaths={showTrailPaths}
                resultsCount={trailCount}
              />
              
              <DiscoverTrailsList
                currentFilters={currentFilters}
                viewMode={viewMode}
                showTrailPaths={showTrailPaths}
                onTrailCountChange={handleTrailCountChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
