
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrailMap from '@/components/map/TrailMap';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mountain, ArrowUpRight, Heart, Users, MessageSquare, Image, ArrowLeft, Star, Cloud, Sun } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';

const Trail = () => {
  const { trailId } = useParams<{ trailId: string }>();
  const [loading, setLoading] = useState(true);
  const [trail, setTrail] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, we would fetch the trail data from Supabase
    // For this demo, we'll use mock data
    const fetchTrailData = () => {
      // This would be a database query in the real app
      setTimeout(() => {
        // Simulating API call delay
        const mockTrail = {
          id: trailId || '1',
          name: "Emerald Forest Loop",
          location: "Boulder, CO",
          coordinates: [-105.2839, 40.0202] as [number, number],
          imageUrl: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop",
          difficulty: "moderate",
          length: 3.2,
          elevation: 450,
          elevationGain: 450,
          elevationLoss: 450,
          duration: "2h 15m",
          tags: ["scenic", "forest", "dog-friendly"],
          likes: 241,
          description: "The Emerald Forest Loop is a spectacular 3.2 mile heavily trafficked loop trail that features beautiful wildflowers and is rated as moderate. The trail offers a number of activity options and is best used from April until October. Dogs are also able to use this trail but must be kept on leash.",
          strainRecommendations: [
            { name: "Green Crack", type: "Sativa", effects: "Energetic, Focus" },
            { name: "Blue Dream", type: "Hybrid", effects: "Creative, Relaxed" }
          ],
          weather: {
            temperature: 72,
            condition: "Partly Cloudy",
            high: 78,
            low: 62,
            precipitation: "10%",
            sunrise: "6:15 AM",
            sunset: "8:03 PM"
          },
          reviews: [
            {
              id: "rev1",
              authorId: "user123",
              authorName: "Mountain Enthusiast",
              authorAvatar: null,
              rating: 5,
              comment: "Absolutely beautiful trail! The views are breathtaking, especially at the second overlook. Make sure to bring plenty of water on hot days.",
              date: "3 days ago"
            },
            {
              id: "rev2",
              authorId: "user456",
              authorName: "NatureWanderer",
              authorAvatar: null,
              rating: 4,
              comment: "Great trail, moderately challenging at some points. Saw some wildlife and amazing flora. The trail can get busy on weekends so go early.",
              date: "1 week ago"
            }
          ],
          photos: [
            { id: "photo1", url: "https://images.unsplash.com/photo-1534174533380-5c8a7e77453b?q=80&w=1000&auto=format&fit=crop", user: "TrailPic01" },
            { id: "photo2", url: "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1000&auto=format&fit=crop", user: "NatureMoments" },
          ]
        };
        
        setTrail(mockTrail);
        setLoading(false);
      }, 800);
    };
    
    fetchTrailData();
  }, [trailId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-greentrail-200 dark:bg-greentrail-800 rounded mb-4"></div>
            <div className="h-4 w-60 bg-greentrail-100 dark:bg-greentrail-900 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!trail) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-2">Trail Not Found</h1>
            <p className="text-greentrail-600 dark:text-greentrail-400 mb-8">The trail you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/discover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={trail.imageUrl} 
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <Link to="/discover" className="text-white/80 hover:text-white mb-2 inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Discover</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{trail.name}</h1>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{trail.location}</span>
          </div>
        </div>
      </div>
      
      {/* Trail Quick Info */}
      <div className="bg-white dark:bg-greentrail-900 border-b border-greentrail-200 dark:border-greentrail-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge className={`px-4 py-1 ${
                trail.difficulty === 'easy' ? 'bg-green-500 hover:bg-green-600' :
                trail.difficulty === 'moderate' ? 'bg-yellow-500 hover:bg-yellow-600' :
                trail.difficulty === 'hard' ? 'bg-red-500 hover:bg-red-600' :
                'bg-black hover:bg-gray-900'
              }`}>
                {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
              </Badge>
              
              <div className="flex items-center text-greentrail-700 dark:text-greentrail-300">
                <span className="font-medium mr-6">{trail.length} miles</span>
                <Mountain className="h-4 w-4 mr-1" />
                <span>{trail.elevationGain}ft gain</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="mr-1 h-4 w-4" />
                <span>Save</span>
              </Button>
              
              <Button variant="outline" size="sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>Directions</span>
              </Button>
              
              {user && (
                <Button size="sm">
                  <Image className="mr-1 h-4 w-4" />
                  <span>Add Photos</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trail Content */}
      <main className="flex-grow bg-greentrail-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map */}
              <Card>
                <CardContent className="p-0 overflow-hidden rounded-lg">
                  <TrailMap 
                    trails={[{
                      id: trail.id,
                      name: trail.name,
                      location: trail.location,
                      coordinates: trail.coordinates,
                      difficulty: trail.difficulty
                    }]}
                    center={trail.coordinates}
                    zoom={14}
                  />
                </CardContent>
              </Card>
              
              {/* Trail Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">About This Trail</h2>
                  <p className="text-greentrail-700 dark:text-greentrail-300 mb-6">{trail.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {trail.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-700 dark:text-greentrail-300 border-greentrail-200 dark:border-greentrail-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Strain Recommendations */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    Recommended Strains
                    {!user && <span className="text-sm font-normal text-greentrail-600 dark:text-greentrail-400 ml-2">(21+ only)</span>}
                  </h2>
                  
                  {user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trail.strainRecommendations.map((strain: any) => (
                        <div key={strain.name} className="bg-greentrail-100 dark:bg-greentrail-800/50 rounded-lg p-4">
                          <h3 className="font-semibold text-greentrail-800 dark:text-greentrail-200">{strain.name}</h3>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-greentrail-600 dark:text-greentrail-400">{strain.type}</span>
                            <span className="text-sm text-greentrail-700 dark:text-greentrail-300">{strain.effects}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-greentrail-200 dark:border-greentrail-800 rounded-lg">
                      <p className="text-greentrail-600 dark:text-greentrail-400 mb-4">
                        Sign in and verify your age to see strain recommendations for this trail.
                      </p>
                      <Button asChild>
                        <Link to="/auth">
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Reviews & Photos Tabs */}
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="reviews">
                    <TabsList className="w-full rounded-none border-b border-greentrail-200 dark:border-greentrail-800">
                      <TabsTrigger value="reviews" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reviews
                      </TabsTrigger>
                      <TabsTrigger value="photos" className="flex-1">
                        <Image className="h-4 w-4 mr-2" />
                        Photos
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reviews" className="p-6">
                      <div className="space-y-6">
                        {trail.reviews.map((review: any) => (
                          <div key={review.id} className="border-b border-greentrail-200 dark:border-greentrail-800 pb-6 last:border-none">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-greentrail-800 dark:text-greentrail-200">
                                    {review.authorName}
                                  </div>
                                  <div className="text-sm text-greentrail-600 dark:text-greentrail-400">
                                    {review.date}
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-greentrail-700 dark:text-greentrail-300">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                        
                        {user ? (
                          <div className="pt-4">
                            <Button>Add Your Review</Button>
                          </div>
                        ) : (
                          <div className="pt-4 text-center">
                            <p className="text-greentrail-600 dark:text-greentrail-400 mb-2">
                              Sign in to leave a review
                            </p>
                            <Button asChild variant="outline" size="sm">
                              <Link to="/auth">Sign In</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="photos" className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {trail.photos.map((photo: any) => (
                          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt="Trail photo" 
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {user && (
                        <div className="mt-6">
                          <Button>Upload Photos</Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Card */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-greentrail-800 dark:text-greentrail-200 flex items-center mb-4">
                    <Cloud className="h-4 w-4 mr-2" />
                    Today's Weather
                  </h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Sun className="h-8 w-8 text-yellow-500 mr-3" />
                      <div>
                        <div className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                          {trail.weather.temperature}°F
                        </div>
                        <div className="text-greentrail-600 dark:text-greentrail-400">
                          {trail.weather.condition}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-greentrail-800 dark:text-greentrail-200">
                        H: {trail.weather.high}° L: {trail.weather.low}°
                      </div>
                      <div className="text-greentrail-600 dark:text-greentrail-400">
                        Precip: {trail.weather.precipitation}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-greentrail-100 dark:bg-greentrail-800 p-2 rounded">
                      <div className="text-greentrail-600 dark:text-greentrail-400">Sunrise</div>
                      <div className="text-greentrail-800 dark:text-greentrail-200 font-medium">
                        {trail.weather.sunrise}
                      </div>
                    </div>
                    <div className="bg-greentrail-100 dark:bg-greentrail-800 p-2 rounded">
                      <div className="text-greentrail-600 dark:text-greentrail-400">Sunset</div>
                      <div className="text-greentrail-800 dark:text-greentrail-200 font-medium">
                        {trail.weather.sunset}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Trail Stats */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">Trail Stats</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-greentrail-600 dark:text-greentrail-400">Distance</span>
                      <span className="font-medium text-greentrail-800 dark:text-greentrail-200">{trail.length} miles</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-greentrail-600 dark:text-greentrail-400">Elevation Gain</span>
                      <span className="font-medium text-greentrail-800 dark:text-greentrail-200">{trail.elevationGain} ft</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-greentrail-600 dark:text-greentrail-400">Elevation Loss</span>
                      <span className="font-medium text-greentrail-800 dark:text-greentrail-200">{trail.elevationLoss} ft</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-greentrail-600 dark:text-greentrail-400">Avg. Duration</span>
                      <span className="font-medium text-greentrail-800 dark:text-greentrail-200">{trail.duration}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-greentrail-600 dark:text-greentrail-400">Route Type</span>
                      <span className="font-medium text-greentrail-800 dark:text-greentrail-200">Loop</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Community Card */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-greentrail-800 dark:text-greentrail-200 flex items-center mb-4">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </h2>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-greentrail-600 dark:text-greentrail-400">{trail.likes} people like this trail</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Like This Trail
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trail;
