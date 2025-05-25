
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  onReset: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({ onReset }) => {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <Button
        variant="outline"
        onClick={onReset}
        className="text-sm"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default FilterActions;
