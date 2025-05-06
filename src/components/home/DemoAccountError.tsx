
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoAccountErrorProps {
  error: string;
  onDismiss?: () => void;
}

export function DemoAccountError({ error, onDismiss }: DemoAccountErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4 relative">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 absolute top-2 right-2 text-destructive-foreground/70 hover:text-destructive-foreground/100"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  );
}
