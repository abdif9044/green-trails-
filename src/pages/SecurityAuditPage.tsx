
import React from 'react';
import { SecurityAuditPanel } from '@/components/security/SecurityAuditPanel';

const SecurityAuditPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
              Security Audit Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive security analysis for your GreenTrails application
            </p>
          </div>
          
          <SecurityAuditPanel />
          
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Common Security Issues & Solutions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-red-600">SSL Connection Errors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ensure your Supabase URL uses HTTPS and check Site URL configuration in Supabase Dashboard
                </p>
              </div>
              <div>
                <h3 className="font-medium text-yellow-600">RLS Policy Issues</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Review Row Level Security policies to ensure proper data access control
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Redirect URL Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Add your application URL to allowed redirect URLs in Supabase Authentication settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPage;
