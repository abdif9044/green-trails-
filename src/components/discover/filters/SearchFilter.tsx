
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ value, onChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <Label htmlFor="search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-greentrail-800 dark:text-greentrail-200">
        Search
      </Label>
      <div className="relative">
        <Input 
          id="search"
          type="search" 
          placeholder="Search trails..." 
          className="py-2 pl-9 pr-3 mt-2"
          value={value}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-2.5 top-0 bottom-0 m-auto w-4 h-4 text-greentrail-500 dark:text-greentrail-400" />
      </div>
    </div>
  );
};

export default SearchFilter;
