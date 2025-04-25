
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrailCard from "@/components/TrailCard";
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
import { Search, MapPin, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Discover = () => {
  // Sample trail data - to be replaced with Supabase data later
  const allTrails = [
    {
      id: "1",
      name: "Emerald Forest Loop",
      location: "Boulder, CO",
      imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 3.2,
      elevation: 450,
      tags: ["scenic", "forest", "dog-friendly"],
      likes: 241
    },
    {
      id: "2",
      name: "Sunrise Mountain Trail",
      location: "Portland, OR",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop",
      difficulty: "hard",
      length: 5.8,
      elevation: 1200,
      tags: ["waterfall", "views", "challenging"],
      likes: 189
    },
    {
      id: "3",
      name: "Riverside Path",
      location: "Austin, TX",
      imageUrl: "https://images.unsplash.com/photo-1523472721958-978152a13ad5?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy",
      length: 2.1,
      elevation: 120,
      tags: ["accessible", "river", "beginner"],
      likes: 312
    },
    {
      id: "4",
      name: "Mountain Creek Trail",
      location: "Seattle, WA",
      imageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 4.3,
      elevation: 850,
      tags: ["creek", "forest", "wildlife"],
      likes: 178
    },
    {
      id: "5",
      name: "Redwood Sanctuary Path",
      location: "San Francisco, CA",
      imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy",
      length: 1.8,
      elevation: 200,
      tags: ["redwoods", "serene", "family-friendly"],
      likes: 422
    },
    {
      id: "6",
      name: "Alpine Summit Route",
      location: "Denver, CO",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
      difficulty: "expert",
      length: 7.6,
      elevation: 2800,
      tags: ["alpine", "views", "challenging"],
      likes: 97
    },
  ] as const;

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [lengthRange, setLengthRange] = useState([0, 10]);
  
  // Filter trails based on search and filters
  const filteredTrails = allTrails.filter(trail => {
    // Text search
    const matchesSearch = 
      searchQuery === '' || 
      trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Difficulty filter
    const matchesDifficulty = !difficultyFilter || trail.difficulty === difficultyFilter;
    
    // Length filter
    const matchesLength = 
      trail.length >= lengthRange[0] && trail.length <= lengthRange[1];
    
    return matchesSearch && matchesDifficulty && matchesLength;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter(null);
    setLengthRange([0, 10]);
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
                {filteredTrails.length} trails found
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
                        <SelectItem value="">Any difficulty</SelectItem>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTrails.length > 0 ? (
                  filteredTrails.map((trail) => (
                    <TrailCard key={trail.id} {...trail} />
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
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Discover;
