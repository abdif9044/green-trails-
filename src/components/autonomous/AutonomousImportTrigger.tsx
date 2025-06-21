
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { AutonomousImportService } from '@/services/autonomous-import-service';

export const AutonomousImportTrigger: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleStartImport = async () => {
    setIsImporting(true);
    setImportResult(null);
    setProgress(0);
    
    try {
      toast({
        title: "🚀 Autonomous Import Started",
        description: "Starting autonomous import of 55,555 trails. This will take approximately 2 hours.",
      });
      
      // Start progress monitoring
      const progressInterval = setInterval(async () => {
        const status = await AutonomousImportService.getImportStatus();
        setProgress(status.progress);
      }, 10000);
      
      // Start the autonomous import
      const result = await AutonomousImportService.start55KImport();
      
      clearInterval(progressInterval);
      setImportResult(result);
      
      if (result.success) {
        toast({
          title: "✅ Import Completed",
          description: `Successfully imported ${result.trailsImported.toLocaleString()} trails in ${Math.round(result.timeElapsed / 1000)}s`,
        });
      } else {
        toast({
          title: "❌ Import Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "❌ Import Error",
        description: "Failed to start autonomous import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-6 w-6 text-green-600" />
          Autonomous Trail Import System
        </CardTitle>
        <CardDescription>
          Fully automated import of 55,555 trails with self-healing capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Target Trails:</span>
            <span className="text-sm text-muted-foreground">55,555</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated Time:</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Timer className="h-4 w-4" />
              ~2 hours
            </span>
          </div>
          
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress:</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>

        {/* Import Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Self-healing architecture</li>
              <li>• Staged import (1K → 5K → 15K → 55K)</li>
              <li>• Automatic error recovery</li>
              <li>• Database optimization</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Geographic Distribution:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 🇺🇸 US: 30,000 trails (54%)</li>
              <li>• 🇨🇦 Canada: 15,000 trails (27%)</li>
              <li>• 🇲🇽 Mexico: 10,555 trails (19%)</li>
            </ul>
          </div>
        </div>

        {/* Import Result */}
        {importResult && (
          <div className={`p-4 rounded-lg border ${
            importResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {importResult.success ? 'Import Successful' : 'Import Failed'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {importResult.message}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStartImport}
          disabled={isImporting}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isImporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Autonomous Import Running...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Autonomous Import of 55,555 Trails
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
