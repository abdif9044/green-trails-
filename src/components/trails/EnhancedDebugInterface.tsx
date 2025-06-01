
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
  Bug,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedDebugImportService } from '@/services/trail-import/enhanced-debug-service';
import { autoBootstrapService } from '@/services/trail-import/auto-bootstrap-service';

export default function EnhancedDebugInterface() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [permissionTest, setPermissionTest] = useState(null);
  const [report, setReport] = useState('');
  const [bootstrapProgress, setBootstrapProgress] = useState({
    isActive: false,
    currentCount: 0,
    targetCount: 30000,
    progressPercent: 0
  });
  const { toast } = useToast();

  // Auto-start the import test and monitor bootstrap progress
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      
      toast({
        title: "🚀 Enhanced Debug Started",
        description: "Testing fixed import system with schema corrections.",
      });
      
      handleEnhancedDebug();
    }
    
    // Monitor bootstrap progress
    const interval = setInterval(updateBootstrapProgress, 5000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  const updateBootstrapProgress = async () => {
    try {
      const progress = await autoBootstrapService.getBootstrapProgress();
      setBootstrapProgress(progress);
    } catch (error) {
      console.error('Error updating bootstrap progress:', error);
    }
  };

  const handleEnhancedDebug = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentPhase('🔧 Initializing FIXED import system...');
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
          description: "RLS policies are blocking imports. Check the detailed errors below.",
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

      // Phase 2: Enhanced Import Test with FIXED schema (20-100%)
      setCurrentPhase('🚀 Starting FIXED 1000-trail import test...');
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
          title: "🎉 SCHEMA FIX: SUCCESS!",
          description: `Imported ${importSummary.successfullyInserted} trails with ${importSummary.successRate.toFixed(1)}% success rate. Fixed schema issues!`,
        });
        setCurrentPhase(`✅ SCHEMA FIXED: ${importSummary.successfullyInserted} trails imported successfully!`);
      } else if (importSummary.successfullyInserted > 0) {
        toast({
          title: "⚠️ Partial Success",
          description: `${importSummary.successfullyInserted} trails imported. Success rate: ${importSummary.successRate.toFixed(1)}%. Check report.`,
          variant: "destructive",
        });
        setCurrentPhase(`⚠️ Partial success: ${importSummary.successfullyInserted}/${importSummary.totalProcessed} trails imported`);
      } else {
        toast({
          title: "❌ Import Still Failing",
          description: "Zero trails imported. Check the detailed report for remaining issues.",
          variant: "destructive",
        });
        setCurrentPhase('❌ Import failed: Zero trails imported - check report for remaining issues');
      }

    } catch (error) {
      console.error('Enhanced debug failed:', error);
      toast({
        title: "💥 Debug Process Failed",
        description: error.message || "Unknown error occurred during debug",
        variant: "destructive",
      });
      setCurrentPhase('💥 Debug process failed - see console for details');
    } finally {
      setIsRunning(false);
    }
  };

  const handleForceBootstrap = async () => {
    try {
      setIsRunning(true);
      setCurrentPhase('🚀 Force triggering 30K bootstrap...');
      
      const success = await autoBootstrapService.forceBootstrap();
      
      if (success) {
        toast({
          title: "🚀 30K Bootstrap Started",
          description: "Loading 30,000 trails with fixed import system",
        });
        setCurrentPhase('✅ 30K bootstrap initiated successfully');
      } else {
        toast({
          title: "❌ Bootstrap Failed",
          description: "Could not start 30K trail bootstrap",
          variant: "destructive",
        });
        setCurrentPhase('❌ 30K bootstrap failed to start');
      }
    } catch (error) {
      console.error('Force bootstrap error:', error);
      toast({
        title: "💥 Bootstrap Error",
        description: "Error during 30K bootstrap trigger",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-red-600">🔧 FIXED Import System Debug</h2>
        <p className="text-muted-foreground">
          Testing with schema corrections: trail_length, terrain_type, proper validation
        </p>
      </div>

      {/* Bootstrap Progress */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            30K Bootstrap Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Trails: {bootstrapProgress.currentCount.toLocaleString()}</span>
              <Badge variant={bootstrapProgress.isActive ? "default" : "secondary"}>
                {bootstrapProgress.isActive ? "Loading..." : "Ready"}
              </Badge>
            </div>
            <Progress value={bootstrapProgress.progressPercent} className="w-full" />
            <div className="text-xs text-gray-600 text-right">
              {bootstrapProgress.progressPercent}% of 30K target
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Start Status */}
      <Alert className="border-blue-200 bg-blue-50">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Status:</strong> {hasStarted ? 'FIXED import system test auto-started!' : 'Preparing to test fixes...'} 
          {isRunning ? ' Testing schema corrections...' : !summary ? ' Initializing...' : ' Test completed!'}
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
                <p className="text-sm mt-1">RLS policies and service role working correctly.</p>
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
              FIXED Import Progress
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
        >
          {isRunning ? (
            <>
              <PlayCircle className="mr-2 h-4 w-4 animate-spin" />
              Testing FIXED System...
            </>
          ) : (
            <>
              <Bug className="mr-2 h-4 w-4" />
              {summary ? 'Re-test FIXED System' : 'Test FIXED Import'}
            </>
          )}
        </Button>

        <Button
          onClick={handleForceBootstrap}
          disabled={isRunning || bootstrapProgress.isActive}
          variant="outline"
          size="lg"
        >
          <Database className="mr-2 h-4 w-4" />
          Force 30K Bootstrap
        </Button>

        <Button
          onClick={updateBootstrapProgress}
          disabled={isRunning}
          variant="outline"
          size="lg"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {/* Status Badges */}
      {summary && (
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant={summary.successRate >= 80 ? "default" : "destructive"}>
            {summary.successRate >= 80 ? "SCHEMA ISSUES FIXED" : "STILL HAS ISSUES"}
          </Badge>
          
          {summary.permissionFailures === 0 && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              RLS WORKING
            </Badge>
          )}
          
          {summary.successfullyInserted > 0 && (
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              IMPORTS WORKING
            </Badge>
          )}

          <Badge variant="outline" className="border-purple-500 text-purple-700">
            CURRENT DB: {bootstrapProgress.currentCount.toLocaleString()} TRAILS
          </Badge>
        </div>
      )}

      {/* Detailed Report */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              FIXED System Debug Report
            </CardTitle>
            <CardDescription>
              Comprehensive analysis with schema corrections applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-96">
              {report}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
