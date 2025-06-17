
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
import { ImportJob } from '@/hooks/trail-import/useImportJobs';

interface ImportJobsTabProps {
  importJobs: ImportJob[];
  loading: boolean;
  getSourceNameById: (sourceId: string) => string;
}

const ImportJobsTab: React.FC<ImportJobsTabProps> = ({
  importJobs,
  loading,
  getSourceNameById
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
        <CardTitle>Recent Import Jobs</CardTitle>
        <CardDescription>
          View the status and results of recent trail import jobs
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
                  <TableHead>Source</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                  <TableHead className="text-right">Processed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No import jobs found
                    </TableCell>
                  </TableRow>
                ) : (
                  importJobs.map((job) => (
                    <TableRow key={job.id} className={job.bulk_job_id ? "bg-slate-50 dark:bg-slate-900" : ""}>
                      <TableCell className="font-medium">
                        {getSourceNameById(job.source_id)}
                        {job.bulk_job_id && (
                          <Badge variant="outline" className="ml-2 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs">
                            Bulk
                          </Badge>
                        )}
                      </TableCell>
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
                      <TableCell className="text-right">{job.trails_added}</TableCell>
                      <TableCell className="text-right">{job.trails_updated}</TableCell>
                      <TableCell className="text-right">{job.trails_processed}</TableCell>
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

export default ImportJobsTab;
