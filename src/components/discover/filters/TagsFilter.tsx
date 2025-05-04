
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

interface TagsFilterProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
}

const TagsFilter: React.FC<TagsFilterProps> = ({ value, onChange, availableTags }) => {
  const handleTagChange = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <AccordionItem value="tags">
      <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Tags
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={value.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${value.includes(tag) ? 'bg-greentrail-600 text-white dark:bg-greentrail-700' : 'text-greentrail-600 dark:text-greentrail-400 border-greentrail-200 dark:border-greentrail-700'}`}
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TagsFilter;
