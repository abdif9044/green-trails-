
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

interface LocationFilterProps {
  country: string | undefined;
  stateProvince: string | undefined;
  onCountryChange: (value: string | undefined) => void;
  onStateProvinceChange: (value: string | undefined) => void;
}

const countryOptions = [
  { value: 'USA', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
];

const stateProvinceOptions = {
  'USA': [
    { value: 'CA', label: 'California' },
    { value: 'WA', label: 'Washington' },
    { value: 'OR', label: 'Oregon' },
  ],
  'Canada': [
    { value: 'BC', label: 'British Columbia' },
    { value: 'AB', label: 'Alberta' },
    { value: 'ON', label: 'Ontario' },
  ],
  'Mexico': [
    { value: 'MX', label: 'Mexico' }
  ]
};

const LocationFilter: React.FC<LocationFilterProps> = ({ 
  country, 
  stateProvince, 
  onCountryChange, 
  onStateProvinceChange 
}) => {
  return (
    <AccordionItem value="location">
      <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Location
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {country && (
          <Select value={stateProvince} onValueChange={onStateProvinceChange}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select state/province" />
            </SelectTrigger>
            <SelectContent>
              {stateProvinceOptions[country as keyof typeof stateProvinceOptions]?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default LocationFilter;
