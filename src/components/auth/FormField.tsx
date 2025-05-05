
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  showError?: boolean;
  children: ReactNode;
}

export const FormField = ({ 
  id, 
  label, 
  error, 
  showError = true,
  children 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {showError && error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
