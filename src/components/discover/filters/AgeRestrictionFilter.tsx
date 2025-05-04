
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

interface AgeRestrictionFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const AgeRestrictionFilter: React.FC<AgeRestrictionFilterProps> = ({ value, onChange }) => {
  return (
    <AccordionItem value="age">
      <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Age Restriction
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox 
            id="ageRestricted"
            checked={value}
            onCheckedChange={onChange}
          />
          <Label htmlFor="ageRestricted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
            Show 21+ trails
          </Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AgeRestrictionFilter;
