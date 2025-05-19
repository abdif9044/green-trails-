
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from '@/components/layout/layout';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/use-auth';
import { useToggleLike, useTrailLikes } from "@/hooks/use-trail-interactions";
import { getTrailWeather } from "@/features/weather/services/weather-service";
import { useTrail } from "@/features/trails/hooks/use-trail";
import TrailHeader from "@/components/trails/TrailHeader";
import TrailContent from "@/components/trails/TrailContent";
import TrailSidebar from "@/components/trails/TrailSidebar";
import TrailStats from "@/components/trails/TrailStats";
import SEOProvider from "@/components/SEOProvider";
import { LazyImage } from "@/components/LazyImage";
import { useDetailedWeather } from '@/features/weather/hooks/use-detailed-weather';

interface Params extends Readonly<Record<string, string | undefined>> {
  trailId?: string;
}

const Trail: React.FC = () => {
  const { trailId } = useParams<Params>();
  const { user } = useAuth();
  const { data: trail, isLoading, error } = useTrail(trailId);
  const [weatherData, setWeatherData] = useState(null);
  
  // Use our enhanced weather hook
  const { data: detailedWeatherData, isLoading: isWeatherLoading } = useDetailedWeather(
    trail?.id,
    trail?.coordinates
  );
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (trail?.id && trail?.coordinates) {
        try {
          const data = await getTrailWeather(trail.id, trail.coordinates);
          setWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
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
    <Layout>
      {trail && (
        <SEOProvider
          title={`${trail.name} - GreenTrails`}
          description={`Explore ${trail.name} in ${trail.location}. ${trail.description?.substring(0, 100)}...`}
          image={trail.imageUrl}
          type="article"
        />
      )}
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
        ) : trail ? (
          <div className="flex-grow">
            <TrailHeader 
              trail={trail} 
              likes={likes} 
              onLikeClick={handleLikeClick} 
            />
            
            <div className="container mx-auto px-4 py-8">
              <TrailStats trailId={trail.id} className="mb-8" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <TrailContent trail={trail} />
                </div>
                
                <div>
                  <TrailSidebar 
                    trailId={trailId as string} 
                    weatherData={detailedWeatherData}
                    isWeatherLoading={isWeatherLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Trail Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the trail you're looking for. 
              It may have been removed or you might have followed a broken link.
            </p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Trail;
