
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoAccountErrorProps {
  error: string;
  onDismiss?: () => void;
}

export function DemoAccountError({ error, onDismiss }: DemoAccountErrorProps) {
  if (!error) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Alert variant="destructive" className="mb-4 relative border-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="pr-6">{error}</AlertDescription>
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 absolute top-2 right-2 text-destructive-foreground/70 hover:text-destructive-foreground/100"
              onClick={onDismiss}
              aria-label="Dismiss error"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
