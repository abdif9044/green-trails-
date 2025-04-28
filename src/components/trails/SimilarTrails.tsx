
import React from "react";
import { Link } from "react-router-dom";
import { useSimilarTrails } from "@/hooks/use-similar-trails";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SimilarTrailsProps {
  trailId: string;
}

const SimilarTrails: React.FC<SimilarTrailsProps> = ({ trailId }) => {
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

export default SimilarTrails;
