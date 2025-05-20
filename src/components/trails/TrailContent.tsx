
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trail } from "@/types/trails";
import TrailMap from "@/components/map/TrailMap";
import TrailDetails from "./TrailDetails";
import TrailComments from "./TrailComments";
import TrailAlbums from "./TrailAlbums";
import AgeRestrictedContent from "./AgeRestrictedContent";
import TrailElevationProfile from "./TrailElevationProfile";
import GroupHikeScheduler from "../community/GroupHikeScheduler";

interface TrailContentProps {
  trail: Trail;
}

const TrailContent: React.FC<TrailContentProps> = ({ trail }) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="group-hikes">Group Hikes</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-6 space-y-4">
        <TrailDetails 
          description={trail.description} 
          strainTags={trail.strainTags}
          difficulty={trail.difficulty}
          length={trail.length}
        />
        
        <TrailElevationProfile
          trailId={trail.id}
          geojson={trail.geojson}
          elevation={trail.elevation}
          elevationGain={trail.elevation_gain}
        />
      </TabsContent>
      
      <TabsContent value="map" className="mt-6">
        <Card>
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <TrailMap
                trails={[trail]}
                center={trail.coordinates}
                zoom={12}
                showTrailPaths={true}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="group-hikes" className="mt-6">
        <AgeRestrictedContent isAgeRestricted={trail.isAgeRestricted}>
          <GroupHikeScheduler trailId={trail.id} trailName={trail.name} />
        </AgeRestrictedContent>
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
