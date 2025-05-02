
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
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { TrailDataSource } from '@/hooks/useTrailImport';

interface DataSourcesTabProps {
  dataSources: TrailDataSource[];
  loading: boolean;
  importLoading: Record<string, boolean>;
  onImport: (sourceId: string) => Promise<void>;
}

const DataSourcesTab: React.FC<DataSourcesTabProps> = ({
  dataSources,
  loading,
  importLoading,
  onImport
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
        <CardTitle>Trail Data Sources</CardTitle>
        <CardDescription>
          Manage and import data from various trail data providers
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No data sources found
                    </TableCell>
                  </TableRow>
                ) : (
                  dataSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>{source.source_type}</TableCell>
                      <TableCell>
                        {source.country}
                        {source.state_province && `, ${source.state_province}`}
                      </TableCell>
                      <TableCell>{formatDate(source.last_synced)}</TableCell>
                      <TableCell>
                        {source.is_active ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => onImport(source.id)}
                          disabled={importLoading[source.id] || !source.is_active}
                          size="sm"
                          className="gap-1"
                        >
                          {importLoading[source.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {importLoading[source.id] ? 'Importing...' : 'Import'}
                        </Button>
                      </TableCell>
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

export default DataSourcesTab;
