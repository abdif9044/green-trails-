
import { Badge } from "@/components/ui/badge";
import { Cannabis } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TrailTagsListProps {
  tags: readonly string[] | string[];
  strainTags?: string[];
}

export const TrailTagsList = ({ tags, strainTags = [] }: TrailTagsListProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className="bg-greentrail-50 text-greentrail-600 border-greentrail-200 hover:bg-greentrail-100 dark:bg-greentrail-900 dark:text-greentrail-300 dark:border-greentrail-700"
        >
          {tag}
        </Badge>
      ))}
      
      {strainTags && strainTags.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
                  "dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
                  "flex items-center gap-1 cursor-help"
                )}
              >
                <Cannabis className="h-3 w-3" />
                <span>{strainTags.length > 1 ? `${strainTags.length} strains` : strainTags[0]}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 p-1">
                <p className="font-medium text-xs">Recommended Strains:</p>
                <div className="flex flex-wrap gap-1">
                  {strainTags.map((strain, idx) => (
                    <span key={idx} className="text-xs">{strain}</span>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
