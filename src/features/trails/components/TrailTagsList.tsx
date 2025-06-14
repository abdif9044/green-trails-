
import { Badge } from "@/components/ui/badge";

interface TrailTagsListProps {
  tags: readonly string[] | string[];
}

export const TrailTagsList = ({ tags }: TrailTagsListProps) => {
  // Don't render anything if no tags
  if (!tags?.length) {
    return null;
  }

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
    </div>
  );
};
