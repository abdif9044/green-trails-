import React, { useState } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { DemoCredentials } from '@/utils/demo-account-storage';

interface DemoCredentialsDisplayProps {
  credentials: DemoCredentials;
  onSignIn?: () => void;
  loading?: boolean;
}

export function DemoCredentialsDisplay({ credentials, onSignIn, loading }: DemoCredentialsDisplayProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-greentrail-50 dark:bg-greentrail-900/30 rounded-lg border border-greentrail-100 dark:border-greentrail-800"
    >
      <div className="flex items-center gap-2 text-greentrail-700 dark:text-greentrail-300 mb-2">
        <Check className="h-5 w-5 text-green-500" />
        <h3 className="font-medium">Demo Account Created!</h3>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Email:</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{credentials.email}</span>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6"
              onClick={() => copyToClipboard(credentials.email, 'email')}
            >
              {copied === 'email' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Password:</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {showPassword ? credentials.password : '••••••••'}
            </span>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6"
              onClick={() => copyToClipboard(credentials.password, 'password')}
            >
              {copied === 'password' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Note: Demo accounts have limited editing capabilities
        </p>
      </div>
    </motion.div>
  );
}
