
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Loader2, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { BulkImportJob } from '@/hooks/useTrailImport';

interface BulkImportJobsTabProps {
  bulkImportJobs: BulkImportJob[];
  loading: boolean;
}

const BulkImportJobsTab: React.FC<BulkImportJobsTabProps> = ({
  bulkImportJobs,
  loading
}) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import Jobs</CardTitle>
        <CardDescription>
          View the status and results of large-scale trail imports
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Requested</TableHead>
                  <TableHead className="text-right">Sources</TableHead>
                  <TableHead className="text-right">Processed</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkImportJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No bulk import jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  bulkImportJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{formatDate(job.started_at)}</TableCell>
                      <TableCell>
                        {job.status === 'completed' ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 gap-1">
                            <Check className="w-3 h-3" />
                            Completed
                          </Badge>
                        ) : job.status === 'processing' ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 gap-1">
                            <Clock className="w-3 h-3" />
                            Processing
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 gap-1">
                            <X className="w-3 h-3" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{job.total_trails_requested.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{job.total_sources}</TableCell>
                      <TableCell className="text-right">{job.trails_processed.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{job.trails_added.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{job.trails_updated.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkImportJobsTab;
