
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrailFilters } from "@/types/trails";
import { Filter, X } from "lucide-react";

export interface DiscoverFiltersProps {
  currentFilters: TrailFilters;
  onFilterChange: (newFilters: TrailFilters) => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ 
  currentFilters, 
  onFilterChange 
}) => {
  const [localFilters, setLocalFilters] = useState<TrailFilters>(currentFilters);
  const [expanded, setExpanded] = useState(false);

  const handleChange = <K extends keyof TrailFilters>(key: K, value: TrailFilters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLengthRangeChange = (value: number[]) => {
    const lengthRange = value.length === 2 ? value as [number, number] : undefined;
    handleChange('lengthRange', lengthRange);
  };

  const clearFilters = () => {
    const emptyFilters: TrailFilters = {
      searchQuery: undefined,
      difficulty: undefined,
      lengthRange: undefined,
      tags: undefined,
      country: undefined,
      stateProvince: undefined,
      showAgeRestricted: false
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h3>
          {Object.values(localFilters).some(v => v !== undefined && v !== false) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground" 
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Input 
              placeholder="Search trails..." 
              value={localFilters.searchQuery || ''}
              onChange={(e) => handleChange('searchQuery', e.target.value || undefined)}
              className="mb-4"
            />
          </div>

          <div>
            <Label className="mb-2 block">Difficulty</Label>
            <Select
              value={localFilters.difficulty || ''}
              onValueChange={(value) => handleChange('difficulty', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Length (miles)</Label>
            <div className="pt-4 px-2">
              <Slider 
                defaultValue={[0, 15]} 
                min={0} 
                max={30} 
                step={0.5}
                value={localFilters.lengthRange || [0, 15]}
                onValueChange={handleLengthRangeChange}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{localFilters.lengthRange ? localFilters.lengthRange[0] : 0} mi</span>
                <span>{localFilters.lengthRange ? localFilters.lengthRange[1] : 15} mi</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-age-restricted"
              checked={localFilters.showAgeRestricted}
              onCheckedChange={(checked) => 
                handleChange('showAgeRestricted', checked === true)
              }
            />
            <Label 
              htmlFor="show-age-restricted"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show 21+ Only Trails
            </Label>
          </div>

          <Button onClick={toggleExpand} variant="outline" size="sm" className="w-full">
            {expanded ? "Show Less" : "Show More Filters"}
          </Button>

          {expanded && (
            <div className="pt-4 space-y-4">
              <div>
                <Label className="mb-2 block">Country</Label>
                <Select
                  value={localFilters.country || ''}
                  onValueChange={(value) => handleChange('country', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any country</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">State/Province</Label>
                <Select
                  value={localFilters.stateProvince || ''}
                  onValueChange={(value) => handleChange('stateProvince', value || undefined)}
                  disabled={!localFilters.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Any state</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoverFilters;
