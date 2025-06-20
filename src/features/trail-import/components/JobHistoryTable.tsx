
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BulkImportJob } from '../types/import-types';

interface JobHistoryTableProps {
  jobs: BulkImportJob[];
  loading: boolean;
}

export const JobHistoryTable: React.FC<JobHistoryTableProps> = ({ jobs, loading }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (job: BulkImportJob) => {
    if (job.status === 'completed' && job.trails_added > 0) {
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    } else if (job.status === 'completed' && job.trails_added === 0) {
      return <Badge variant="destructive">Failed</Badge>;
    } else if (job.status === 'processing') {
      return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
    } else {
      return <Badge variant="secondary">{job.status}</Badge>;
    }
  };

  const getSuccessRate = (job: BulkImportJob) => {
    if (job.trails_processed === 0) return 0;
    return Math.round((job.trails_added / job.trails_processed) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading import history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Import Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No import jobs found</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(job.status)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job)}
                      <span className="text-sm font-medium">
                        {new Date(job.started_at).toLocaleDateString()} {new Date(job.started_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Processed: {job.trails_processed.toLocaleString()} • 
                      Added: {job.trails_added.toLocaleString()} • 
                      Failed: {job.trails_failed.toLocaleString()}
                    </div>
                    {job.trails_processed > 0 && (
                      <div className="text-sm">
                        Success Rate: <span className={getSuccessRate(job) > 50 ? 'text-green-600' : 'text-red-600'}>
                          {getSuccessRate(job)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Target: {job.total_trails_requested.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
