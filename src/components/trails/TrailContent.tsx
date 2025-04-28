
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trail } from "@/types/trails";
import TrailMap from "@/components/map/TrailMap";
import TrailDetails from "./TrailDetails";
import TrailComments from "./TrailComments";
import TrailAlbums from "./TrailAlbums";
import AgeRestrictedContent from "./AgeRestrictedContent";

interface TrailContentProps {
  trail: Trail;
}

const TrailContent: React.FC<TrailContentProps> = ({ trail }) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-6 space-y-4">
        <TrailDetails 
          description={trail.description} 
          strainTags={trail.strainTags} 
        />
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
                likes: trail.likes,
                isAgeRestricted: trail.isAgeRestricted
              }]}
              center={trail.coordinates}
              zoom={12}
              className="h-[400px] w-full"
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="albums" className="mt-6">
        <AgeRestrictedContent isAgeRestricted={trail.isAgeRestricted}>
          <TrailAlbums trailId={trail.id} />
        </AgeRestrictedContent>
      </TabsContent>
      
      <TabsContent value="comments" className="mt-6">
        <AgeRestrictedContent isAgeRestricted={trail.isAgeRestricted}>
          <TrailComments trailId={trail.id} />
        </AgeRestrictedContent>
      </TabsContent>
    </Tabs>
  );
};

export default TrailContent;
