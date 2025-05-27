
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Database } from 'lucide-react';

const DiscoverRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auto-import page immediately
    navigate('/auto-import');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-greentrail-950 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Database className="h-12 w-12 text-greentrail-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Starting Production Import</h2>
              <p className="text-muted-foreground">
                Redirecting to auto-import to begin importing 55,000+ trails...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Preparing import...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverRedirect;
