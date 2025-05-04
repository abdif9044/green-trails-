
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({ onReset, onApply }) => {
  return (
    <div className="mt-6 flex justify-between">
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset Filters
        <X className="w-4 h-4 ml-2" />
      </Button>
      <Button size="sm" onClick={onApply}>
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterActions;
