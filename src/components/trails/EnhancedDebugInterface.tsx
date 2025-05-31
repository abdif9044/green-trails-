
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  PlayCircle, 
  Database, 
  Users, 
  TrendingUp,
  Zap,
  Shield,
  Bug
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedDebugImportService } from '@/services/trail-import/enhanced-debug-service';

export default function EnhancedDebugInterface() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [permissionTest, setPermissionTest] = useState(null);
  const [report, setReport] = useState('');
  const { toast } = useToast();

  // Auto-start the 1000 trail import test immediately when component mounts
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      
      // Show immediate feedback
      toast({
        title: "🚀 Auto-Starting 1000 Trail Import Test",
        description: "Enhanced debug sequence initiated with user permission.",
      });
      
      // Start immediately (no delay)
      handleEnhancedDebug();
    }
  }, [hasStarted]);

  const handleEnhancedDebug = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentPhase('🔧 Initializing enhanced debug system...');
    setSummary(null);
    setPermissionTest(null);
    setReport('');

    const debugService = new EnhancedDebugImportService();

    try {
      // Phase 1: Test Database Permissions (10%)
      setCurrentPhase('🔐 Testing database permissions and RLS policies...');
      setProgress(10);
      
      const permissionResults = await debugService.testDatabasePermissions();
      setPermissionTest(permissionResults);
      
      if (!permissionResults.hasPermissions) {
        toast({
          title: "❌ Permission Test Failed",
          description: "RLS policies are still blocking imports. Check the detailed errors below.",
          variant: "destructive",
        });
        setCurrentPhase('❌ Permission test failed - RLS policies need fixing');
        setIsRunning(false);
        return;
      }

      toast({
        title: "✅ Permission Test Passed",
        description: "RLS policies are working correctly for imports!",
      });

      // Phase 2: Enhanced Import Test (20-100%)
      setCurrentPhase('🚀 Starting enhanced 1000-trail import test...');
      setProgress(20);

      // Run the enhanced batch import with progress tracking
      const importSummary = await debugService.runEnhancedBatchImport(1000);
      setSummary(importSummary);

      // Phase 3: Generate Report (100%)
      setCurrentPhase('📊 Generating detailed debug report...');
      setProgress(100);

      const detailedReport = debugService.generateDetailedReport(importSummary);
      setReport(detailedReport);

      // Show final results
      if (importSummary.successRate >= 80) {
        toast({
          title: "🎉 Enhanced Debug: SUCCESS!",
          description: `Imported ${importSummary.successfullyInserted} trails with ${importSummary.successRate.toFixed(1)}% success rate. Ready for scale-up!`,
        });
        setCurrentPhase(`✅ SUCCESS: ${importSummary.successfullyInserted} trails imported successfully!`);
      } else if (importSummary.successfullyInserted > 0) {
        toast({
          title: "⚠️ Partial Success",
          description: `Some trails imported but success rate is ${importSummary.successRate.toFixed(1)}%. Check report for issues.`,
          variant: "destructive",
        });
        setCurrentPhase(`⚠️ Partial success: ${importSummary.successfullyInserted}/${importSummary.totalProcessed} trails imported`);
      } else {
        toast({
          title: "❌ Import Failed",
          description: "Zero trails were imported. Check the detailed report for root cause analysis.",
          variant: "destructive",
        });
        setCurrentPhase('❌ Import failed: Zero trails imported - see detailed report');
      }

    } catch (error) {
      console.error('Enhanced debug failed:', error);
      toast({
        title: "💥 Debug Process Failed",
        description: error.message || "Unknown error occurred during enhanced debug",
        variant: "destructive",
      });
      setCurrentPhase('💥 Debug process failed - see console for details');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-red-600">🚨 Enhanced Debug Mode</h2>
        <p className="text-muted-foreground">
          Testing 1000-trail import with comprehensive validation and error analysis
        </p>
      </div>

      {/* Auto-Start Status */}
      <Alert className="border-blue-200 bg-blue-50">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Status:</strong> {hasStarted ? 'Enhanced debug test has been auto-started!' : 'Preparing to auto-start...'} 
          {isRunning ? ' Currently running import test...' : !summary ? ' Initializing...' : ' Test completed!'}
        </AlertDescription>
      </Alert>

      {/* Permission Test Results */}
      {permissionTest && (
        <Card className={permissionTest.hasPermissions ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {permissionTest.hasPermissions ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
              Database Permission Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {permissionTest.hasPermissions ? (
              <div className="text-green-700">
                <p className="font-medium">✅ All permission tests passed!</p>
                <p className="text-sm mt-1">RLS policies are working correctly for trail imports.</p>
              </div>
            ) : (
              <div className="text-red-700">
                <p className="font-medium">❌ Permission issues detected:</p>
                <ul className="text-sm mt-2 space-y-1">
                  {permissionTest.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      {(isRunning || currentPhase) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRunning ? <PlayCircle className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              Import Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{currentPhase || 'Waiting to start...'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Results */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="text-center pb-2">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <CardTitle className="text-lg">{summary.totalProcessed.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>Trails Processed</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <CardTitle className="text-lg text-green-600">{summary.successfullyInserted.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>Successfully Added</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <CardTitle className="text-lg">{summary.successRate.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>Success Rate</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <CardTitle className="text-lg text-red-600">{summary.detailedFailures.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>Detailed Failures</CardDescription>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button 
          onClick={handleEnhancedDebug}
          disabled={isRunning}
          variant={summary?.successRate >= 80 ? "default" : "destructive"}
          size="lg"
          data-enhanced-debug-trigger
        >
          {isRunning ? (
            <>
              <PlayCircle className="mr-2 h-4 w-4 animate-spin" />
              Running Enhanced Debug...
            </>
          ) : (
            <>
              <Bug className="mr-2 h-4 w-4" />
              {summary ? 'Re-run Enhanced Debug' : 'Start Enhanced Debug'}
            </>
          )}
        </Button>

        {summary && summary.successRate >= 80 && (
          <Button
            onClick={() => window.location.href = '/discover'}
            variant="outline"
            size="lg"
          >
            <Shield className="mr-2 h-4 w-4" />
            View Imported Trails
          </Button>
        )}
      </div>

      {/* Detailed Report */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Detailed Debug Report
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of the 1000-trail import test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-96">
              {report}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Status Badges */}
      {summary && (
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant={summary.successRate >= 80 ? "default" : "destructive"}>
            {summary.successRate >= 80 ? "READY FOR SCALE-UP" : "NEEDS FIXES"}
          </Badge>
          
          {summary.permissionFailures === 0 && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              RLS POLICIES FIXED
            </Badge>
          )}
          
          {summary.successfullyInserted > 0 && (
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              TRAILS IMPORTING
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
