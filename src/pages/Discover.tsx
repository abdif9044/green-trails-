
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrailMap from "@/components/map/TrailMap";
import { useNavigate } from 'react-router-dom';
import { useTrails } from '@/hooks/use-trails';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverTrailsList from '@/components/discover/DiscoverTrailsList';
import DiscoverViewControls from '@/components/discover/DiscoverViewControls';
import SEOProvider from "@/components/SEOProvider";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [lengthRange, setLengthRange] = useState<[number, number]>([0, 10]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showAgeRestricted, setShowAgeRestricted] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [showTrailPaths, setShowTrailPaths] = useState(true);

  const navigate = useNavigate();

  const { data: trails = [], isLoading } = useTrails({
    searchQuery,
    difficulty: difficultyFilter,
    lengthRange,
    showAgeRestricted,
    country: countryFilter,
    stateProvince: stateFilter
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter(null);
    setLengthRange([0, 10]);
    setCountryFilter(null);
    setStateFilter(null);
    setShowTrailPaths(true);
  };

  const handleTrailClick = (trailId: string) => {
    navigate(`/trail/${trailId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="Discover Trails - GreenTrails"
        description="Find and explore the best hiking trails for cannabis-friendly adventures. Filter by difficulty, length, and more."
      />
      
      <Navbar />
      
      <DiscoverHeader trailCount={trails.length} />
      
      <div className="flex-grow bg-white dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <DiscoverFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                difficultyFilter={difficultyFilter}
                setDifficultyFilter={setDifficultyFilter}
                lengthRange={lengthRange}
                setLengthRange={setLengthRange}
                showAgeRestricted={showAgeRestricted}
                setShowAgeRestricted={setShowAgeRestricted}
                countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}
                stateFilter={stateFilter}
                setStateFilter={setStateFilter}
                onResetFilters={handleResetFilters}
              />
            </div>
            
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
                  Trails
                </h2>
                <DiscoverViewControls
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  showTrailPaths={showTrailPaths}
                  onToggleTrailPaths={() => setShowTrailPaths(!showTrailPaths)}
                />
              </div>
              
              <Tabs value={viewMode} className="mt-6">
                <TabsContent value="list" className="mt-0">
                  <DiscoverTrailsList
                    trails={trails}
                    onResetFilters={handleResetFilters}
                  />
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <div className="bg-white dark:bg-greentrail-900 rounded-xl shadow-sm overflow-hidden">
                    <TrailMap 
                      trails={trails} 
                      onTrailSelect={handleTrailClick}
                      className="h-[600px] w-full"
                      showTrailPaths={showTrailPaths}
                      country={countryFilter || undefined}
                      stateProvince={stateFilter || undefined}
                      difficulty={difficultyFilter || undefined}
                    />
                  </div>
                  
                  {trails.length === 0 && (
                    <div className="py-6 text-center mt-4">
                      <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">
                        No trails found
                      </h3>
                      <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-4">
                        Try adjusting your search criteria or filters to find trails that match your preferences.
                      </p>
                      <button onClick={handleResetFilters}>Reset Filters</button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Discover;
