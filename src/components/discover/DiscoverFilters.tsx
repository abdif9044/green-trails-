
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  X,
  SlidersHorizontal,
  Mountain,
  Flag,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrailDifficulty } from "@/types/trails";
import { supabase } from "@/integrations/supabase/client";

interface DiscoverFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  difficultyFilter: string | null;
  setDifficultyFilter: (difficulty: string | null) => void;
  lengthRange: [number, number];
  setLengthRange: (range: [number, number]) => void;
  showAgeRestricted: boolean;
  setShowAgeRestricted: (show: boolean) => void;
  countryFilter?: string | null;
  setCountryFilter?: (country: string | null) => void;
  stateFilter?: string | null;
  setStateFilter?: (state: string | null) => void;
  onResetFilters: () => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  lengthRange,
  setLengthRange,
  showAgeRestricted,
  setShowAgeRestricted,
  countryFilter,
  setCountryFilter,
  stateFilter,
  setStateFilter,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  
  // Fetch available countries and states from the database
  useEffect(() => {
    const fetchCountriesAndStates = async () => {
      try {
        // Fetch distinct countries
        const { data: countriesData, error: countriesError } = await supabase
          .from('trails')
          .select('country')
          .not('country', 'is', null)
          .order('country')
          .limit(100);
          
        if (countriesError) throw countriesError;
        
        // Extract unique countries
        const uniqueCountries = Array.from(
          new Set(
            countriesData
              .map(item => item.country)
              .filter(Boolean) // Remove null values
          )
        );
        
        setCountries(uniqueCountries);
        
        // Fetch states if a country is selected
        if (countryFilter) {
          const { data: statesData, error: statesError } = await supabase
            .from('trails')
            .select('state_province')
            .eq('country', countryFilter)
            .not('state_province', 'is', null)
            .order('state_province')
            .limit(100);
            
          if (statesError) throw statesError;
          
          // Extract unique states
          const uniqueStates = Array.from(
            new Set(
              statesData
                .map(item => item.state_province)
                .filter(Boolean) // Remove null values
            )
          );
          
          setStates(uniqueStates);
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching countries/states:', error);
      }
    };
    
    fetchCountriesAndStates();
  }, [countryFilter]);

  const difficultyOptions: { value: TrailDifficulty; label: string }[] = [
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "hard", label: "Hard" },
    { value: "expert", label: "Expert" },
  ];

  const handleDifficultySelect = (value: string) => {
    setDifficultyFilter(value === "all" ? null : value as TrailDifficulty);
  };
  
  const handleCountrySelect = (value: string) => {
    if (setCountryFilter) {
      setCountryFilter(value === "all" ? null : value);
      // When changing country, reset state
      if (setStateFilter) {
        setStateFilter(null);
      }
    }
  };
  
  const handleStateSelect = (value: string) => {
    if (setStateFilter) {
      setStateFilter(value === "all" ? null : value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {(difficultyFilter || lengthRange[0] > 0 || lengthRange[1] < 10 || showAgeRestricted || countryFilter || stateFilter) && (
            <Badge variant="secondary" className="ml-2 bg-greentrail-100 text-greentrail-800 dark:bg-greentrail-800 dark:text-greentrail-200">
              <X className="h-3 w-3 mr-1" onClick={(e) => { 
                e.stopPropagation();
                onResetFilters();
              }} />
              Reset
            </Badge>
          )}
        </Button>
      </div>
      
      <div className={`space-y-4 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
        <Card className="border-slate-200 dark:border-greentrail-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Search</CardTitle>
            <CardDescription>Find trails by name or location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-greentrail-500" />
              <Input 
                type="search" 
                placeholder="Search trails..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-greentrail-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Difficulty</CardTitle>
            <CardDescription>Filter by trail difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={difficultyFilter || "all"} onValueChange={handleDifficultySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <Mountain className="mr-2 h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {setCountryFilter && (
          <Card className="border-slate-200 dark:border-greentrail-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Location</CardTitle>
              <CardDescription>Filter by country and state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={countryFilter || "all"} 
                  onValueChange={handleCountrySelect}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        <div className="flex items-center">
                          <Flag className="mr-2 h-4 w-4" />
                          {country}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {countryFilter && setStateFilter && (
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Select 
                    value={stateFilter || "all"} 
                    onValueChange={handleStateSelect}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {state}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Card className="border-slate-200 dark:border-greentrail-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Length</CardTitle>
            <CardDescription>Filter by trail length (miles)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              <Slider
                defaultValue={[0, 10]}
                value={lengthRange}
                min={0}
                max={20}
                step={0.5}
                minStepsBetweenThumbs={1}
                onValueChange={(value) => setLengthRange([value[0], value[1]])}
              />
              <div className="flex justify-between text-sm text-greentrail-600 dark:text-greentrail-400">
                <div>{lengthRange[0]} miles</div>
                <div>{lengthRange[1] === 20 ? '20+ miles' : `${lengthRange[1]} miles`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-greentrail-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="age-restricted" className="text-base font-normal">
                Show Age Restricted
              </Label>
              <Switch
                id="age-restricted"
                checked={showAgeRestricted}
                onCheckedChange={setShowAgeRestricted}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={onResetFilters} 
              className="w-full"
            >
              Reset All Filters
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DiscoverFilters;
