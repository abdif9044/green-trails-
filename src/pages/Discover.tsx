
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrailCard from "@/components/TrailCard";
import TrailMap from "@/components/map/TrailMap";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
import { Button } from "@/components/ui/button";
import { Search, MapPin, Compass, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrails } from '@/hooks/use-trails';
import { Link, useNavigate } from 'react-router-dom';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [lengthRange, setLengthRange] = useState([0, 10]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const navigate = useNavigate();
  
  // Fetch trails using our custom hook
  const { data: trails = [], isLoading } = useTrails({
    searchQuery,
    difficulty: difficultyFilter,
    lengthRange,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter(null);
    setLengthRange([0, 10]);
  };

  const handleTrailClick = (trailId: string) => {
    navigate(`/trail/${trailId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-greentrail-800 dark:bg-greentrail-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Trails</h1>
              <p className="text-greentrail-200">Find your next adventure</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="bg-greentrail-600 hover:bg-greentrail-700 text-white py-2 px-4 text-lg">
                {trails.length} trails found
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow bg-white dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-greentrail-50 dark:bg-greentrail-900 p-4 rounded-xl shadow-sm sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-greentrail-800 dark:text-greentrail-200">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetFilters}
                    className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Search */}
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
                  
                  {/* Difficulty */}
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-greentrail-700 dark:text-greentrail-300 mb-2">
                      Difficulty
                    </label>
                    <Select value={difficultyFilter || ""} onValueChange={(value) => setDifficultyFilter(value || null)}>
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
                  
                  {/* Length */}
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
                        onValueChange={setLengthRange}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-greentrail-600 dark:text-greentrail-400">
                        <span>{lengthRange[0]} miles</span>
                        <span>{lengthRange[1]} miles</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Filters */}
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
            </div>
            
            {/* Trail Cards */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
                  Trails
                </h2>
                <div className="flex items-center gap-3">
                  <Tabs 
                    value={viewMode} 
                    onValueChange={(value) => setViewMode(value as 'list' | 'map')}
                    className="mr-2"
                  >
                    <TabsList className="grid grid-cols-2 h-9 w-[160px]">
                      <TabsTrigger value="list" className="text-xs">
                        <Compass className="h-4 w-4 mr-1" />
                        List View
                      </TabsTrigger>
                      <TabsTrigger value="map" className="text-xs">
                        <Map className="h-4 w-4 mr-1" />
                        Map View
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-[180px] bg-white dark:bg-greentrail-800 border-greentrail-200 dark:border-greentrail-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="length-asc">Length (Shortest)</SelectItem>
                      <SelectItem value="length-desc">Length (Longest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs value={viewMode} className="mt-6">
                <TabsContent value="list" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trails.length > 0 ? (
                      trails.map((trail) => (
                        <Link to={`/trail/${trail.id}`} key={trail.id}>
                          <TrailCard {...trail} />
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                          <Compass size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">No trails found</h3>
                        <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-4">
                          Try adjusting your search criteria or filters to find trails that match your preferences.
                        </p>
                        <Button onClick={handleResetFilters}>
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <div className="bg-white dark:bg-greentrail-900 rounded-xl shadow-sm overflow-hidden">
                    <TrailMap 
                      trails={trails} 
                      onTrailSelect={handleTrailClick}
                      className="h-[600px] w-full"
                    />
                  </div>
                  
                  {trails.length === 0 && (
                    <div className="py-6 text-center mt-4">
                      <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">No trails found</h3>
                      <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-4">
                        Try adjusting your search criteria or filters to find trails that match your preferences.
                      </p>
                      <Button onClick={handleResetFilters}>
                        Reset Filters
                      </Button>
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
