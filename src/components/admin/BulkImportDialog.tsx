
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Database, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrailDataSource } from '@/hooks/useTrailImport';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSources: TrailDataSource[];
  selectedSources: string[];
  onSourceSelect: (sourceId: string) => void;
  trailCount: number;
  onTrailCountChange: (count: number) => void;
  onBulkImport: () => Promise<boolean>;
  loading: boolean;
}

const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  dataSources,
  selectedSources,
  onSourceSelect,
  trailCount,
  onTrailCountChange,
  onBulkImport,
  loading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-greentrail-600 hover:bg-greentrail-700 text-white gap-2">
          <Database className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Trail Import</DialogTitle>
          <DialogDescription>
            Select data sources and the number of trails to import in bulk.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Select Data Sources</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {dataSources.filter(s => s.is_active).map(source => (
                <div key={source.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`source-${source.id}`}
                    className="rounded border-gray-300"
                    checked={selectedSources.includes(source.id)}
                    onChange={() => onSourceSelect(source.id)}
                  />
                  <Label htmlFor={`source-${source.id}`} className="text-sm">
                    {source.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Number of Trails: {trailCount.toLocaleString()}</Label>
            <Slider
              value={[trailCount]}
              min={100}
              max={60000}
              step={100}
              onValueChange={(value) => onTrailCountChange(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>30,000</span>
              <span>60,000</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onBulkImport} 
            disabled={loading || selectedSources.length === 0}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {loading ? 'Starting...' : 'Start Bulk Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
