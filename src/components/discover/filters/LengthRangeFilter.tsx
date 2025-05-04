
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

interface LengthRangeFilterProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const LengthRangeFilter: React.FC<LengthRangeFilterProps> = ({ value, onChange }) => {
  return (
    <AccordionItem value="length">
      <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Length (miles)
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>{value[0]}</span>
          <span>{value[1]}</span>
        </div>
        <Slider
          defaultValue={value}
          min={0}
          max={20}
          step={1}
          onValueChange={onChange}
          className="mt-2"
        />
      </AccordionContent>
    </AccordionItem>
  );
};

export default LengthRangeFilter;
