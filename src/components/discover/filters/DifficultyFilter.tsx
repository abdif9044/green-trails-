
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

interface DifficultyFilterProps {
  value: string | null;
  onChange: (value: string | undefined) => void;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ value, onChange }) => {
  const handleDifficultyChange = (selectedValue: string | undefined) => {
    onChange(selectedValue);
  };

  return (
    <AccordionItem value="difficulty">
      <AccordionTrigger className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Difficulty
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <Select value={value || undefined} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DifficultyFilter;
