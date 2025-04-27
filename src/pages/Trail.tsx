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
import TrailAlbums from "@/components/trails/TrailAlbums";
import TrailRating from "@/components/trails/TrailRating";
import TrailStats from "@/components/trails/TrailStats";
import { useSimilarTrails } from "@/hooks/use-similar-trails";

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
      ) : trail ? (
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
                  <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-2">
                    {trail.name}
                  </h1>
                  <div className="flex items-center gap-2 text-greentrail-600 dark:text-greentrail-400">
                    <MapPin className="h-4 w-4" />
                    {trail.location}
                  </div>
                  <TrailRating trailId={trail.id} className="mt-2" />
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
          
          <div className="container mx-auto px-4 py-8">
            <TrailStats trailId={trail.id} className="mb-8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                    <TabsTrigger value="albums">Albums</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
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
                            const strain: StrainTag = {
                              name: strainTag,
                              type: 'hybrid',
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
                  
                  <TabsContent value="albums" className="mt-6">
                    {trail.isAgeRestricted && !ageVerified ? (
                      <AgeRestrictionWarning onVerified={() => setAgeVerified(true)} />
                    ) : (
                      <TrailAlbums trailId={trail.id} />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-6">
                    {trail.isAgeRestricted && !ageVerified ? (
                      <AgeRestrictionWarning onVerified={() => setAgeVerified(true)} />
                    ) : (
                      <TrailComments trailId={trail.id} />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
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
                
                <SimilarTrails trailId={trail.id} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      
      <Footer />
    </div>
  );
};

const SimilarTrails = ({ trailId }: { trailId: string }) => {
  const { data: similarTrails, isLoading } = useSimilarTrails(trailId);

  if (isLoading || !similarTrails?.length) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <h3 className="text-lg font-semibold text-greentrail-800 dark:text-greentrail-200">
          Similar Trails
        </h3>
        <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
        <div className="space-y-4">
          {similarTrails.map((trail) => (
            <Link 
              key={trail.id} 
              to={`/trail/${trail.id}`}
              className="block group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={trail.imageUrl}
                  alt={trail.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-greentrail-700 group-hover:text-greentrail-600 dark:text-greentrail-300">
                    {trail.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{trail.location}</p>
                  <Badge variant="secondary" className="mt-1">
                    {trail.difficulty}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Trail;
