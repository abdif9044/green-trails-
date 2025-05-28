
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DebugImportService } from '@/services/trail-import/debug-import-service';
import { 
  Bug, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2,
  FileText,
  Download
} from 'lucide-react';

interface DebugStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message?: string;
  details?: any;
}

const DebugImportInterface: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [steps, setSteps] = useState<DebugStep[]>([
    { id: 'environment', name: 'Environment Validation', status: 'pending' },
    { id: 'single-record', name: 'Single Record Import Test', status: 'pending' },
    { id: 'network', name: 'Network Connectivity Test', status: 'pending' },
    { id: 'batch-import', name: 'Batch Import Test (10K)', status: 'pending' },
    { id: 'summary', name: 'Generate Summary Report', status: 'pending' }
  ]);
  const [debugReport, setDebugReport] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const updateStepStatus = (stepId: string, status: DebugStep['status'], message?: string, details?: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message, details } : step
    ));
  };

  const runDebugSequence = async () => {
    setIsRunning(true);
    setProgress(0);
    setDebugReport('');

    const debugService = new DebugImportService();

    try {
      // Step 1: Environment validation
      setCurrentStep('environment');
      updateStepStatus('environment', 'running');
      setProgress(10);

      const envValid = await debugService.validateEnvironment();
      updateStepStatus('environment', envValid ? 'success' : 'error', 
        envValid ? 'Environment validated successfully' : 'Environment validation failed');
      
      if (!envValid) {
        setCurrentStep('');
        setIsRunning(false);
        return;
      }

      // Step 2: Single record test
      setCurrentStep('single-record');
      updateStepStatus('single-record', 'running');
      setProgress(30);

      await debugService.testSingleRecordImport();
      updateStepStatus('single-record', 'success', 'Single record tests completed');

      // Step 3: Network test
      setCurrentStep('network');
      updateStepStatus('network', 'running');
      setProgress(50);

      await debugService.testNetworkConnectivity();
      updateStepStatus('network', 'success', 'Network connectivity verified');

      // Step 4: Batch import test
      setCurrentStep('batch-import');
      updateStepStatus('batch-import', 'running', 'Running 10K trail import...');
      setProgress(70);

      const summary = await debugService.runBatchImportTest(10000);
      const batchSuccess = summary.successRate >= 80;
      updateStepStatus('batch-import', batchSuccess ? 'success' : 'warning', 
        `Import completed: ${summary.successRate.toFixed(1)}% success rate`, summary);

      // Step 5: Generate report
      setCurrentStep('summary');
      updateStepStatus('summary', 'running');
      setProgress(90);

      const report = debugService.generateSummaryReport(summary);
      setDebugReport(report);
      updateStepStatus('summary', 'success', 'Debug report generated');

      setProgress(100);
      setCurrentStep('');

    } catch (error) {
      console.error('Debug sequence failed:', error);
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
    a.download = `trail-import-debug-report-${new Date().toISOString().slice(0, 19)}.txt`;
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
            <Bug className="h-6 w-6 text-red-600" />
            Trail Import Pipeline Debugger
          </CardTitle>
          <CardDescription>
            End-to-end debugging of the trail import system to achieve 80%+ success rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Target: 8,000+ successful imports out of 10,000 trails (80% success rate)
            </div>
            <Button 
              onClick={runDebugSequence}
              disabled={isRunning}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Debug...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Debug Sequence
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

      {/* Debug Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Steps Progress</CardTitle>
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
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
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

      {/* Summary Alert */}
      {!isRunning && completedSteps > 0 && (
        <Alert variant={errorSteps === 0 ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Debug sequence completed: {completedSteps} successful steps, {errorSteps} errors.
            {errorSteps === 0 ? ' All systems appear operational.' : ' Issues detected that require attention.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Debug Report */}
      {debugReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Debug Report
            </CardTitle>
            <CardDescription>
              Complete analysis with recommendations for fixing import issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs whitespace-pre-wrap font-mono overflow-x-auto">
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

export default DebugImportInterface;
