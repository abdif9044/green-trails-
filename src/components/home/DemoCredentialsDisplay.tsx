
import React from 'react';
import { Check } from 'lucide-react';
import { DemoCredentials } from '@/hooks/use-demo-account';

interface DemoCredentialsDisplayProps {
  credentials: DemoCredentials;
}

export function DemoCredentialsDisplay({ credentials }: DemoCredentialsDisplayProps) {
  return (
    <div className="p-4 bg-greentrail-50 dark:bg-greentrail-900/30 rounded-lg">
      <div className="flex items-center gap-2 text-greentrail-700 dark:text-greentrail-300 mb-2">
        <Check className="h-5 w-5 text-green-500" />
        <h3 className="font-medium">Demo Account Created!</h3>
      </div>
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Email:</span> {credentials.email}</p>
        <p><span className="font-semibold">Password:</span> {credentials.password}</p>
      </div>
    </div>
  );
}
