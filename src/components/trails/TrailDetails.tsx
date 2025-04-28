
import React from "react";
import { Separator } from "@/components/ui/separator";
import { StrainTag } from "@/types/trails";
import StrainTagBadge from "./StrainTagBadge";

interface TrailDetailsProps {
  description: string | undefined;
  strainTags: string[] | StrainTag[] | undefined;
}

const TrailDetails: React.FC<TrailDetailsProps> = ({ description, strainTags }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
          Trail Description
        </h3>
        <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
        <p className="text-greentrail-700 dark:text-greentrail-300">
          {description || 'No description available.'}
        </p>
      </div>
      
      {strainTags && strainTags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200">
            Strain Tags
          </h3>
          <Separator className="bg-greentrail-200 dark:bg-greentrail-700" />
          <div className="flex flex-wrap gap-2">
            {strainTags.map((strainTag) => {
              const strain: StrainTag = {
                name: typeof strainTag === 'string' ? strainTag : strainTag.name,
                type: 'hybrid',
                effects: []
              };
              return (
                <StrainTagBadge key={typeof strainTag === 'string' ? strainTag : strainTag.name} strain={strain} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailDetails;
