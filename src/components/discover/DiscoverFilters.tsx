
import React from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, Cannabis } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface DiscoverFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  difficultyFilter: string | null;
  setDifficultyFilter: (value: string | null) => void;
  lengthRange: [number, number];
  setLengthRange: (value: [number, number]) => void;
  showAgeRestricted: boolean;
  setShowAgeRestricted: (value: boolean) => void;
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
  onResetFilters
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAgeRestrictedToggle = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be signed in and age verified to see 21+ content",
        variant: "destructive"
      });
      return;
    }
    setShowAgeRestricted(!showAgeRestricted);
  };

  return (
    <div className="bg-greentrail-50 dark:bg-greentrail-900 p-4 rounded-xl shadow-sm sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-greentrail-800 dark:text-greentrail-200">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetFilters}
          className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-greentrail-700 dark:text-greentrail-300 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-greentrail-500 dark:text-greentrail-400" />
            <Input
              id="search"
              placeholder="Trail name, location, or tags"
              className="pl-9 bg-white dark:bg-greentrail-800 border-greentrail-200 dark:border-greentrail-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-greentrail-700 dark:text-greentrail-300 mb-2">
            Difficulty
          </label>
          <Select 
            value={difficultyFilter || "all"} 
            onValueChange={(value) => setDifficultyFilter(value === "all" ? null : value)}
          >
            <SelectTrigger id="difficulty" className="bg-white dark:bg-greentrail-800 border-greentrail-200 dark:border-greentrail-700">
              <SelectValue placeholder="Any difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-greentrail-700 dark:text-greentrail-300 mb-2">
            Trail Length
          </label>
          <div className="px-2">
            <Slider
              defaultValue={[0, 10]}
              min={0}
              max={10}
              step={0.5}
              value={lengthRange}
              onValueChange={(value) => setLengthRange(value as [number, number])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-greentrail-600 dark:text-greentrail-400">
              <span>{lengthRange[0]} miles</span>
              <span>{lengthRange[1]} miles</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-greentrail-200 dark:border-greentrail-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cannabis className="h-4 w-4 text-purple-600" />
              <label htmlFor="age-restricted" className="text-sm font-medium text-greentrail-700 dark:text-greentrail-300">
                21+ Content
              </label>
            </div>
            <Switch 
              id="age-restricted" 
              checked={showAgeRestricted}
              onCheckedChange={handleAgeRestrictedToggle}
              disabled={!user}
            />
          </div>
          {!user && (
            <p className="text-xs text-muted-foreground mt-1">
              <Link to="/auth" className="text-greentrail-600 hover:underline">Sign in</Link> to view 21+ content
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="border-t border-greentrail-200 dark:border-greentrail-700 pt-2">
          <AccordionItem value="features">
            <AccordionTrigger className="text-greentrail-700 dark:text-greentrail-300">
              Features
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="feature-waterfall" />
                  <label htmlFor="feature-waterfall" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Waterfall
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="feature-viewpoint" />
                  <label htmlFor="feature-viewpoint" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Scenic Viewpoint
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="feature-forest" />
                  <label htmlFor="feature-forest" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Forest
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="feature-river" />
                  <label htmlFor="feature-river" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    River/Creek
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tags">
            <AccordionTrigger className="text-greentrail-700 dark:text-greentrail-300">
              Tags
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="tag-dogfriendly" />
                  <label htmlFor="tag-dogfriendly" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Dog-friendly
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tag-kid-friendly" />
                  <label htmlFor="tag-kid-friendly" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Kid-friendly
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tag-accessible" />
                  <label htmlFor="tag-accessible" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Accessible
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tag-camping" />
                  <label htmlFor="tag-camping" className="text-sm text-greentrail-700 dark:text-greentrail-300">
                    Camping
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default DiscoverFilters;
