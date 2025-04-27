
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TrailMap from "@/components/map/TrailMap";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mountain, ArrowUpRight, Heart, Users, MessageSquare, Image, ArrowLeft, Star, Cloud, Sun } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { Trail as TrailType, StrainTag } from '@/types/trails';
import { useToggleLike, useTrailLikes } from "@/hooks/use-trail-interactions";
import TrailComments from "@/components/trails/TrailComments";
import AgeRestrictionWarning from "@/components/trails/AgeRestrictionWarning";
import WeatherInfo from "@/components/trails/WeatherInfo";
import { getTrailWeather } from "@/services/weather-service";
import StrainTagBadge from "@/components/trails/StrainTagBadge";

interface Params extends Readonly<Record<string, string | undefined>> {
  trailId?: string;
}

const Trail: React.FC = () => {
  const { trailId } = useParams<Params>();
  const [trail, setTrail] = useState<TrailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!trailId) return;

    setIsLoading(true);
    
    const fetchTrail = async () => {
      try {
        const response = await fetch(`/api/trails/${trailId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrail(data);
      } catch (error) {
        console.error("Could not fetch trail:", error);
        setTrail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrail();
  }, [trailId]);

  // Add this after the existing useEffect for fetching trail data
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (trail?.id && trail?.coordinates) {
        setIsWeatherLoading(true);
        try {
          const data = await getTrailWeather(trail.id, trail.coordinates);
          setWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setIsWeatherLoading(false);
        }
      }
    };
    
    fetchWeatherData();
  }, [trail?.id, trail?.coordinates]);

  const { data: likes, refetch: refetchLikes } = useTrailLikes(trailId || '');
  const { mutate: toggleLike } = useToggleLike(trailId || '');

  const handleLikeClick = async () => {
    if (!user) {
      // Handle unauthenticated state, maybe redirect to login
      return;
    }

    await toggleLike();
    await refetchLikes();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      ) : (
        <></>
      )}
      
      {trail && (
        <div className="flex-grow">
          <div className="bg-greentrail-50 dark:bg-greentrail-900 py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <Link to="/discover" className="flex items-center gap-2 text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Trails
                </Link>
                <Button onClick={handleLikeClick}>
                  <Heart className="h-4 w-4 mr-2" />
                  {likes} Likes
                </Button>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-2">{trail.name}</h1>
                  <div className="flex items-center gap-2 text-greentrail-600 dark:text-greentrail-400">
                    <MapPin className="h-4 w-4" />
                    {trail.location}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {trail.isAgeRestricted && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                      21+
                    </Badge>
                  )}
                  <Badge className={`bg-${trail.difficulty}-100 text-${trail.difficulty}-800 dark:bg-${trail.difficulty}-800 dark:text-${trail.difficulty}-100`}>
                    {trail.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-greentrail-600 dark:text-greentrail-400">
                  <Mountain className="h-4 w-4" />
                  {trail.elevation} ft
                </div>
                <div className="flex items-center gap-2 text-greentrail-600 dark:text-greentrail-400">
                  <ArrowUpRight className="h-4 w-4" />
                  {trail.length} miles
                </div>
              </div>
            </div>
          </div>
          
          {/* Update the content section to include the comments tab */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
                        About {trail.name}
                      </h3>
                      <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
                      <p className="text-greentrail-700 dark:text-greentrail-300">
                        {trail.description || 'No description available.'}
                      </p>
                    </div>
                    
                    {trail.strainTags && trail.strainTags.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
                          Strain Tags
                        </h3>
                        <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
                        <div className="flex flex-wrap gap-2">
                          {trail.strainTags.map((strainTag) => {
                            // Create proper StrainTag objects
                            const strain: StrainTag = {
                              name: strainTag,
                              type: 'hybrid', // Default type since we don't have this info from the string
                              effects: []
                            };
                            return (
                              <StrainTagBadge key={strainTag} strain={strain} />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="map" className="mt-6">
                    <Card>
                      <CardContent className="p-0">
                        <TrailMap
                          trails={[{
                            id: trail.id,
                            name: trail.name,
                            location: trail.location,
                            coordinates: trail.coordinates,
                            difficulty: trail.difficulty,
                            imageUrl: trail.imageUrl,
                            length: trail.length,
                            elevation: trail.elevation,
                            tags: trail.tags,
                            likes: trail.likes
                          }]}
                          center={trail.coordinates}
                          zoom={12}
                          className="h-[400px] w-full"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-6">
                    {trail.isAgeRestricted && !ageVerified ? (
                      <AgeRestrictionWarning onVerified={() => setAgeVerified(true)} />
                    ) : (
                      <TrailComments trailId={trail.id} />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="photos" className="mt-6">
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                        <Image className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-2">No Photos Yet</h3>
                      <p className="text-greentrail-600 dark:text-greentrail-400 max-w-md mx-auto mb-6">
                        Be the first to share your experience on this trail with the GreenTrails community.
                      </p>
                      <Button asChild>
                        <Link to={`/albums/new?trailId=${trail.id}`}>
                          Upload Photos
                        </Link>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Weather Card */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Cloud className="h-4 w-4 text-greentrail-600" />
                    Current Weather
                  </h3>
                  <WeatherInfo 
                    temperature={weatherData?.temperature}
                    condition={weatherData?.condition}
                    high={weatherData?.high}
                    low={weatherData?.low}
                    precipitation={weatherData?.precipitation}
                    sunrise={weatherData?.sunrise}
                    sunset={weatherData?.sunset}
                    isLoading={isWeatherLoading}
                  />
                </div>
                
                <Card>
                  <CardContent className="space-y-3">
                    <h3 className="text-lg font-semibold text-greentrail-800 dark:text-greentrail-200">
                      Share this Trail
                    </h3>
                    <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
                    <div className="flex justify-around">
                      <Button variant="outline" size="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.3598 7.64016L16.9498 6.22016C15.4098 4.68016 12.8698 4.68016 11.3298 6.22016L5.63984 11.9002C4.09984 13.4402 4.09984 15.9802 5.63984 17.5202C7.17984 19.0602 9.71984 19.0602 11.2598 17.5202L16.9498 11.8302C18.4898 10.2902 18.4898 7.75016 16.9498 6.22016L18.3598 7.64016ZM12.0098 17.0002L10.5898 15.5802C9.04984 14.0402 9.04984 11.5002 10.5898 9.96016L16.2798 4.27016C17.8198 2.73016 20.3598 2.73016 21.8998 4.27016C23.4398 5.81016 23.4398 8.35016 21.8998 9.89016L16.2098 15.5802C14.6698 17.1202 12.1298 17.1202 10.5898 15.5802L12.0098 17.0002Z" fill="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 2H6C4.79135 2 3.62935 2.47487 2.75736 3.34315C1.88537 4.21143 1.39194 5.37068 1.39194 6.6V17.4C1.39194 18.6293 1.86681 19.7913 2.73509 20.6633C3.60337 21.5353 4.76262 22.0287 5.99194 22.0287C6 5.02873 18 5.02873 18 22.0287C19.2374 22.0287 20.3966 21.5539 21.2649 20.6856C22.1332 19.8173 22.6081 18.6581 22.6081 17.4V6.6C22.6081 5.37068 22.1147 4.21143 21.2427 3.34315C20.3707 2.47487 19.2087 2 18 2ZM18 4.4C18 4.4 18 19.6 18 20.4C18 21.2 17.2 22 6 22C6 22 5.2 21.2 5.2 20.4C5.2 19.6 5.2 4.4 5.2 4.4H18Z" fill="currentColor"/>
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.4601 6C21.6901 6.33 20.8701 6.56 20.0301 6.67C20.8601 6.17 21.5401 5.42 22.0301 4.54C21.2201 5.02 20.3201 5.38 19.3701 5.59C18.6001 4.79 17.5401 4.28 16.3601 4.28C13.8501 4.28 11.8301 6.29 11.8301 8.81C11.8301 9.12 11.8601 9.43 11.9101 9.72C7.89007 9.51 4.11007 7.41 1.63007 4.75C1.22007 5.44 0.97007 6.21 0.97007 7.04C0.97007 8.82 1.88007 10.34 3.23007 11.32C2.57007 11.3 1.94007 11.12 1.38007 10.83C1.38007 10.85 1.38007 10.88 1.38007 10.91C1.38007 13.38 3.15007 15.35 5.41007 15.83C4.93007 15.96 4.42007 16.02 3.89007 16.02C3.55007 16.02 3.22007 15.99 2.90007 15.93C3.57007 17.94 5.37007 19.31 7.59007 19.31C5.83007 20.69 3.63007 21.5 1.17007 21.5C0.82007 21.5 0.48007 21.48 0.14007 21.42C2.45007 22.95 5.26007 23.87 8.32007 23.87C16.3401 23.87 21.1901 16.3 21.1901 9.27C21.1901 9.01 21.1801 8.76 21.1601 8.51C21.9801 7.9 22.6201 7.14 23.0301 6.25C22.4601 6 22.4601 6Z" fill="currentColor"/>
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="space-y-3">
                    <h3 className="text-lg font-semibold text-greentrail-800 dark:text-greentrail-200">
                      Similar Trails
                    </h3>
                    <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
                    <p className="text-sm text-muted-foreground">
                      Explore other trails in the area that you might enjoy.
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Link to="/trail/1" className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                          Boulder Falls
                        </Link>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Easy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Link to="/trail/2" className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                          Royal Arch Trail
                        </Link>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Moderate
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Link to="/trail/3" className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                          Mount Sanitas
                        </Link>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          Hard
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Trail;
