
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, CheckCircle, AlertCircle, Timer, Zap, Database } from 'lucide-react';
import { AutonomousImportService } from '@/services/autonomous-import-service';

export const AutonomousImportTrigger: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [trailsImported, setTrailsImported] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Auto-start import on component mount
  useEffect(() => {
    handleStartImport();
  }, []);

  const handleStartImport = async () => {
    setIsImporting(true);
    setImportResult(null);
    setProgress(0);
    setCurrentPhase('Initializing...');
    setStartTime(new Date());
    
    try {
      toast({
        title: "🚀 Autonomous Import Started",
        description: "Starting autonomous import of 55,555 trails across 4 geographic regions.",
      });
      
      // Start progress monitoring
      const progressInterval = setInterval(async () => {
        const status = await AutonomousImportService.getImportStatus();
        setProgress(status.progress);
        setTrailsImported(status.currentCount);
        
        // Update phase based on progress
        if (status.progress < 25) {
          setCurrentPhase('Phase 1: Database Health Check');
        } else if (status.progress < 50) {
          setCurrentPhase('Phase 2: Trail Generation');
        } else if (status.progress < 90) {
          setCurrentPhase('Phase 3: Batch Import Processing');
        } else if (status.progress < 100) {
          setCurrentPhase('Phase 4: Validation & Cleanup');
        } else {
          setCurrentPhase('Complete');
        }
      }, 5000);
      
      // Start the autonomous import
      const result = await AutonomousImportService.start55KImport();
      
      clearInterval(progressInterval);
      setImportResult(result);
      
      if (result.success) {
        setProgress(100);
        setCurrentPhase('Complete');
        toast({
          title: "✅ Import Completed Successfully",
          description: `Successfully imported ${result.trailsImported.toLocaleString()} trails in ${Math.round(result.timeElapsed / 1000)}s`,
        });
      } else {
        toast({
          title: "⚠️ Import Issues Detected",
          description: result.message,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "❌ Import System Error",
        description: "Autonomous import system encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getElapsedTime = () => {
    if (!startTime) return '0s';
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-green-600" />
          Autonomous Trail Import System - EXECUTING
        </CardTitle>
        <CardDescription>
          Importing 55,555 trails with self-healing architecture across 4 geographic regions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{trailsImported.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Trails Imported</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{getElapsedTime()}</div>
            <div className="text-sm text-muted-foreground">Elapsed Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Import Progress:</span>
            <span className="text-sm text-muted-foreground">{currentPhase}</span>
          </div>
          <Progress value={progress} className="w-full h-3" />
        </div>

        {/* Geographic Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-800">🇺🇸 United States</div>
            <div className="text-sm text-blue-600">33,333 trails</div>
            <div className="text-xs text-blue-500">60% coverage</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="font-medium text-red-800">🇨🇦 Canada</div>
            <div className="text-sm text-red-600">11,111 trails</div>
            <div className="text-xs text-red-500">20% coverage</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-medium text-green-800">🇲🇽 Mexico</div>
            <div className="text-sm text-green-600">5,556 trails</div>
            <div className="text-xs text-green-500">10% coverage</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="font-medium text-purple-800">🌍 Global</div>
            <div className="text-sm text-purple-600">5,555 trails</div>
            <div className="text-xs text-purple-500">10% coverage</div>
          </div>
        </div>

        {/* System Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              System Features:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Self-healing architecture</li>
              <li>• 4-phase import process</li>
              <li>• Real-time progress monitoring</li>
              <li>• Automatic error recovery</li>
              <li>• Database optimization</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Import Phases:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Phase 1: Database Health Check</li>
              <li>• Phase 2: Trail Generation</li>
              <li>• Phase 3: Batch Import Processing</li>
              <li>• Phase 4: Validation & Cleanup</li>
            </ul>
          </div>
        </div>

        {/* Import Result */}
        {importResult && (
          <div className={`p-4 rounded-lg border ${
            importResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {importResult.success ? 'Import Successful' : 'Import Completed with Notes'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {importResult.message}
            </p>
            {importResult.success && (
              <div className="mt-3 text-sm font-medium text-green-700">
                🎉 GreenTrails is now ready for production with {importResult.trailsImported.toLocaleString()} trails!
              </div>
            )}
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center">
          {isImporting ? (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <span className="font-medium">Autonomous Import System Running...</span>
            </div>
          ) : importResult?.success ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Production Ready - 55K+ Trails Loaded</span>
            </div>
          ) : (
            <Button 
              onClick={handleStartImport}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Restart Import Process
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
