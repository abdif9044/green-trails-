import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TrailFilters } from "@/types/trails";
import NearbyTrailsButton from './NearbyTrailsButton';

export interface DiscoverFiltersProps {
  currentFilters: TrailFilters;
  onFilterChange: (filters: TrailFilters) => void;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

const countryOptions = [
  { value: 'USA', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
];

const stateProvinceOptions = {
  'USA': [
    { value: 'CA', label: 'California' },
    { value: 'WA', label: 'Washington' },
    { value: 'OR', label: 'Oregon' },
  ],
  'Canada': [
    { value: 'BC', label: 'British Columbia' },
    { value: 'AB', label: 'Alberta' },
    { value: 'ON', label: 'Ontario' },
  ],
  'Mexico': [
    { value: 'MX', label: 'Mexico' }
  ]
};

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ currentFilters, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>(currentFilters.searchQuery || '');
  const [difficulty, setDifficulty] = React.useState<string | null>(currentFilters.difficulty || null);
  const [lengthRange, setLengthRange] = React.useState<number[]>(currentFilters.lengthRange || [0, 20]);
  const [tags, setTags] = React.useState<string[]>(currentFilters.tags || []);
  const [showAgeRestricted, setShowAgeRestricted] = React.useState<boolean>(currentFilters.showAgeRestricted || false);
  const [country, setCountry] = React.useState<string | undefined>(currentFilters.country);
  const [stateProvince, setStateProvince] = React.useState<string | undefined>(currentFilters.stateProvince);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDifficultyChange = (value: string | undefined) => {
    setDifficulty(value || null);
  };

  const handleLengthChange = (value: number[]) => {
    setLengthRange(value);
  };

  const handleTagChange = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAgeRestrictedChange = (checked: boolean) => {
    setShowAgeRestricted(checked);
  };

  const handleCountryChange = (value: string | undefined) => {
    setCountry(value);
    setStateProvince(undefined); // Reset state/province when country changes
  };

  const handleStateProvinceChange = (value: string | undefined) => {
    setStateProvince(value);
  };

  const handleNearbyTrailsFound = (longitude: number, latitude: number) => {
    // When location is found, we'll update filters to show trails near the user
    // For now, we'll just set a filter that would be handled in the TrailsQuery component
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

  const availableTags = ['mountain', 'forest', 'lake', 'river', 'desert', 'coastal', 'waterfall', 'scenic', 'loop', 'challenging'];

  return (
    <div className="bg-white dark:bg-greentrail-900 rounded-md shadow-sm p-4">
      <Label htmlFor="search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Search
      </Label>
      <div className="relative">
        <Input 
          id="search"
          type="search" 
          placeholder="Search trails..." 
          className="py-2 pl-9 pr-3 mt-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-2.5 top-0 bottom-0 m-auto w-4 h-4 text-greentrail-500 dark:text-greentrail-400" />
      </div>

      <NearbyTrailsButton onLocationFound={handleNearbyTrailsFound} />

      <Accordion type="single" collapsible className="mt-4" defaultValue="difficulty">
        <AccordionItem value="difficulty">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Difficulty
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <Select value={difficulty || undefined} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="length">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Length (miles)
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
              <span>{lengthRange[0]}</span>
              <span>{lengthRange[1]}</span>
            </div>
            <Slider
              defaultValue={lengthRange}
              min={0}
              max={20}
              step={1}
              onValueChange={handleLengthChange}
              className="mt-2"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Tags
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${tags.includes(tag) ? 'bg-greentrail-600 text-white dark:bg-greentrail-700' : 'text-greentrail-600 dark:text-greentrail-400 border-greentrail-200 dark:border-greentrail-700'}`}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Age Restriction
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="ageRestricted"
                checked={showAgeRestricted}
                onCheckedChange={handleAgeRestrictedChange}
              />
              <Label htmlFor="ageRestricted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
                Show 21+ trails
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Location
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {country && (
              <Select value={stateProvince} onValueChange={handleStateProvinceChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select state/province" />
                </SelectTrigger>
                <SelectContent>
                  {stateProvinceOptions[country as keyof typeof stateProvinceOptions]?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
          <X className="w-4 h-4 ml-2" />
        </Button>
        <Button size="sm" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DiscoverFilters;
