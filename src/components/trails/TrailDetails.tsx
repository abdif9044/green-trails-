
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StrainTag } from "@/types/trails";
import MarkdownFormatter from "@/utils/markdown-formatter";
import StrainPairingSystem from "./StrainPairingSystem";

interface TrailDetailsProps {
  description?: string;
  strainTags?: StrainTag[] | string[];
  difficulty?: string;
  length?: number;
}

const TrailDetails: React.FC<TrailDetailsProps> = ({ 
  description, 
  strainTags = [],
  difficulty = 'moderate',
  length = 0
}) => {
  // Transform string[] to StrainTag[] if needed
  const formattedStrainTags: StrainTag[] = strainTags.map(tag => {
    if (typeof tag === 'string') {
      return {
        name: tag,
        type: 'hybrid',
        effects: []
      };
    }
    return tag;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Trail Description</h3>
          <div className="prose max-w-none dark:prose-invert">
            {description ? (
              <MarkdownFormatter content={description} />
            ) : (
              <p className="text-muted-foreground">No detailed description available for this trail.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {formattedStrainTags.length > 0 && (
        <StrainPairingSystem 
          strainTags={formattedStrainTags}
          trailDifficulty={difficulty}
          trailLength={length}
        />
      )}
    </div>
  );
};

export default TrailDetails;
