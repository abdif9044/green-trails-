
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { TrailFilters } from "@/types/trails";
import NearbyTrailsButton from './NearbyTrailsButton';
import SearchFilter from './filters/SearchFilter';
import DifficultyFilter from './filters/DifficultyFilter';
import LengthRangeFilter from './filters/LengthRangeFilter';
import TagsFilter from './filters/TagsFilter';
import AgeRestrictionFilter from './filters/AgeRestrictionFilter';
import LocationFilter from './filters/LocationFilter';
import FilterActions from './filters/FilterActions';

export interface DiscoverFiltersProps {
  currentFilters: TrailFilters;
  onFilterChange: (filters: TrailFilters) => void;
}

const availableTags = [
  'mountain', 'forest', 'lake', 'river', 'desert', 
  'coastal', 'waterfall', 'scenic', 'loop', 'challenging'
];

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ currentFilters, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>(currentFilters.searchQuery || '');
  const [difficulty, setDifficulty] = React.useState<string | null>(currentFilters.difficulty || null);
  const [lengthRange, setLengthRange] = React.useState<number[]>(currentFilters.lengthRange || [0, 20]);
  const [tags, setTags] = React.useState<string[]>(currentFilters.tags || []);
  const [showAgeRestricted, setShowAgeRestricted] = React.useState<boolean>(currentFilters.showAgeRestricted || false);
  const [country, setCountry] = React.useState<string | undefined>(currentFilters.country);
  const [stateProvince, setStateProvince] = React.useState<string | undefined>(currentFilters.stateProvince);

  const handleCountryChange = (value: string | undefined) => {
    setCountry(value);
    setStateProvince(undefined); // Reset state/province when country changes
  };

  const handleNearbyTrailsFound = (longitude: number, latitude: number) => {
    // When location is found, we'll update filters to show trails near the user
    const updatedFilters: TrailFilters = {
      ...currentFilters,
      nearbyCoordinates: [longitude, latitude],
      // Clear any existing location filters to avoid conflicts
      country: undefined,
      stateProvince: undefined
    };
    onFilterChange(updatedFilters);
  };

  const applyFilters = () => {
    const filters: TrailFilters = {
      searchQuery: searchQuery || undefined,
      difficulty: difficulty || undefined,
      lengthRange: lengthRange.length === 2 ? [lengthRange[0], lengthRange[1]] : undefined,
      tags: tags.length > 0 ? tags : undefined,
      showAgeRestricted: showAgeRestricted,
      country: country || undefined,
      stateProvince: stateProvince || undefined,
    };
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDifficulty(null);
    setLengthRange([0, 20]);
    setTags([]);
    setShowAgeRestricted(false);
    setCountry(undefined);
    setStateProvince(undefined);
    
    // Apply empty filters to clear all
    onFilterChange({});
  };

  return (
    <div className="bg-white dark:bg-greentrail-900 rounded-md shadow-sm p-4">
      <SearchFilter 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      
      <NearbyTrailsButton onLocationFound={handleNearbyTrailsFound} />

      <Accordion type="single" collapsible className="mt-4" defaultValue="difficulty">
        <DifficultyFilter 
          value={difficulty} 
          onChange={setDifficulty} 
        />
        
        <LengthRangeFilter 
          value={lengthRange} 
          onChange={setLengthRange} 
        />
        
        <TagsFilter 
          value={tags} 
          onChange={setTags} 
          availableTags={availableTags} 
        />
        
        <AgeRestrictionFilter 
          value={showAgeRestricted} 
          onChange={setShowAgeRestricted} 
        />
        
        <LocationFilter 
          country={country} 
          stateProvince={stateProvince} 
          onCountryChange={handleCountryChange} 
          onStateProvinceChange={setStateProvince} 
        />
      </Accordion>

      <FilterActions 
        onReset={resetFilters} 
        onApply={applyFilters} 
      />
    </div>
  );
};

export default DiscoverFilters;
