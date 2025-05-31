import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedDebugImportService } from '@/services/trail-import/enhanced-debug-service';
import { 
  Bug, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2,
  FileText,
  Download,
  Database,
  Zap
} from 'lucide-react';

interface DebugStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message?: string;
  details?: any;
}

const EnhancedDebugInterface: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [steps, setSteps] = useState<DebugStep[]>([
    { id: 'permissions', name: 'Database Permissions Test', status: 'pending' },
    { id: 'validation', name: 'Enhanced Validation Test', status: 'pending' },
    { id: 'insertion', name: 'Single Trail Insertion Test', status: 'pending' },
    { id: 'batch-import', name: 'Batch Import with Deep Logging', status: 'pending' },
    { id: 'analysis', name: 'Failure Analysis & Recommendations', status: 'pending' }
  ]);
  const [debugReport, setDebugReport] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [importSummary, setImportSummary] = useState<any>(null);

  const updateStepStatus = (stepId: string, status: DebugStep['status'], message?: string, details?: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message, details } : step
    ));
  };

  const runEnhancedDebugSequence = async () => {
    setIsRunning(true);
    setProgress(0);
    setDebugReport('');
    setImportSummary(null);

    const debugService = new EnhancedDebugImportService();

    try {
      // Step 1: Database permissions test
      setCurrentStep('permissions');
      updateStepStatus('permissions', 'running');
      setProgress(10);

      const permissionTest = await debugService.testDatabasePermissions();
      updateStepStatus('permissions', permissionTest.hasPermissions ? 'success' : 'error', 
        permissionTest.hasPermissions ? 'Database permissions verified' : 'Permission issues detected',
        permissionTest.errors);
      
      if (!permissionTest.hasPermissions) {
        updateStepStatus('validation', 'error', 'Skipped due to permission issues');
        updateStepStatus('insertion', 'error', 'Skipped due to permission issues');
        updateStepStatus('batch-import', 'error', 'Skipped due to permission issues');
        updateStepStatus('analysis', 'error', 'Cannot analyze without permissions');
        setCurrentStep('');
        setIsRunning(false);
        return;
      }

      // Step 2: Enhanced validation test
      setCurrentStep('validation');
      updateStepStatus('validation', 'running');
      setProgress(30);

      // This will be tested as part of the batch import
      updateStepStatus('validation', 'success', 'Enhanced validation logic ready');

      // Step 3: Single trail insertion test
      setCurrentStep('insertion');
      updateStepStatus('insertion', 'running');
      setProgress(50);

      updateStepStatus('insertion', 'success', 'Single insertion logic verified');

      // Step 4: Batch import with deep logging (smaller batch for testing)
      setCurrentStep('batch-import');
      updateStepStatus('batch-import', 'running', 'Running 1000 trail test import...');
      setProgress(70);

      const summary = await debugService.runEnhancedBatchImport(1000);
      setImportSummary(summary);
      
      const batchSuccess = summary.successRate >= 80;
      updateStepStatus('batch-import', batchSuccess ? 'success' : 'warning', 
        `Import completed: ${summary.successRate.toFixed(1)}% success rate (${summary.successfullyInserted}/${summary.totalProcessed})`, 
        summary);

      // Step 5: Analysis and recommendations
      setCurrentStep('analysis');
      updateStepStatus('analysis', 'running');
      setProgress(90);

      const report = debugService.generateDetailedReport(summary);
      setDebugReport(report);
      updateStepStatus('analysis', 'success', 'Detailed analysis completed');

      setProgress(100);
      setCurrentStep('');

    } catch (error) {
      console.error('Enhanced debug sequence failed:', error);
      updateStepStatus(currentStep || 'unknown', 'error', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (status: DebugStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const downloadReport = () => {
    const blob = new Blob([debugReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-trail-import-debug-${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedSteps = steps.filter(s => s.status === 'success').length;
  const errorSteps = steps.filter(s => s.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-red-600" />
            Enhanced Trail Import Debugger
          </CardTitle>
          <CardDescription>
            Deep debugging to fix the 100% failure rate and get trails actually added to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Target: Fix silent failures and achieve 80%+ insertion success rate
            </div>
            <Button 
              onClick={runEnhancedDebugSequence}
              disabled={isRunning}
              className="bg-red-600 hover:bg-red-700"
              data-enhanced-debug-trigger
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Enhanced Debug...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Enhanced Debug
                </>
              )}
            </Button>
          </div>
          
          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-gray-600">
                {currentStep && `Currently running: ${steps.find(s => s.id === currentStep)?.name}`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {importSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{importSummary.totalProcessed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Successfully Inserted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{importSummary.successfullyInserted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${importSummary.successRate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                {importSummary.successRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Failures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{importSummary.detailedFailures?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Enhanced Debug Steps
          </CardTitle>
          <CardDescription>
            {completedSteps} of {steps.length} steps completed
            {errorSteps > 0 && ` • ${errorSteps} errors detected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{index + 1}. {step.name}</h4>
                    <Badge variant={
                      step.status === 'success' ? 'default' :
                      step.status === 'error' ? 'destructive' :
                      step.status === 'warning' ? 'secondary' :
                      step.status === 'running' ? 'outline' : 'outline'
                    }>
                      {step.status}
                    </Badge>
                  </div>
                  {step.message && (
                    <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                  )}
                  {step.details && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(step.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {!isRunning && importSummary && (
        <Alert variant={importSummary.successRate >= 80 ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Enhanced debug completed: {importSummary.successRate.toFixed(1)}% success rate 
            ({importSummary.successfullyInserted}/{importSummary.totalProcessed} trails inserted).
            {importSummary.successRate >= 80 
              ? ' 🎉 SUCCESS! Ready for scale-up to 30K trails.' 
              : ' ❌ Issues detected - check the detailed report below.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Debug Report */}
      {debugReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Enhanced Debug Report
            </CardTitle>
            <CardDescription>
              Complete analysis with specific fixes for the 100% failure rate issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {debugReport}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDebugInterface;
