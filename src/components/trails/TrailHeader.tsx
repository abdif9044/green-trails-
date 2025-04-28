
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MapPin, Mountain, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trail } from "@/types/trails";
import TrailRating from "./TrailRating";

interface TrailHeaderProps {
  trail: Trail;
  likes: number;
  onLikeClick: () => void;
}

const TrailHeader: React.FC<TrailHeaderProps> = ({ trail, likes, onLikeClick }) => {
  return (
    <div className="bg-greentrail-50 dark:bg-greentrail-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/discover" className="flex items-center gap-2 text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
            <ArrowLeft className="h-5 w-5" />
            Back to Trails
          </Link>
          <Button onClick={onLikeClick}>
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
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 mr-2">
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
  );
};

export default TrailHeader;
