
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { autoBootstrapService } from '@/services/trail-import/auto-bootstrap-service';
import { useToast } from '@/hooks/use-toast';

// Import the smaller components
import { StatusBadge } from './bootstrap/StatusBadge';
import { RochesterImportCard } from './bootstrap/RochesterImportCard';
import { DiagnosticsCard } from './bootstrap/DiagnosticsCard';
import { ProgressSection } from './bootstrap/ProgressSection';
import { StatusMessages } from './bootstrap/StatusMessages';
import { ActionButtons } from './bootstrap/ActionButtons';

export default function AutoBootstrapStatus() {
  const [progress, setProgress] = useState({
    isActive: false,
    currentCount: 0,
    targetCount: 30000,
    progressPercent: 0
  });
  const [bootstrapStatus, setBootstrapStatus] = useState<'checking' | 'needed' | 'complete' | 'active'>('checking');
  const [isLoading, setIsLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState<{ hasPermissions: boolean; errors: string[] } | null>(null);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const [rochesterImporting, setRochesterImporting] = useState(false);
  const [rochesterAutoTriggered, setRochesterAutoTriggered] = useState(false);
  const { toast } = useToast();

  // Check bootstrap status on mount
  useEffect(() => {
    checkBootstrapStatus();
    
    // Set up polling for progress updates
    const interval = setInterval(updateProgress, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-trigger Rochester import immediately if needed
  useEffect(() => {
    if (progress.currentCount < 1000 && !rochesterAutoTriggered && !isLoading) {
      setRochesterAutoTriggered(true);
      
      toast({
        title: "🎯 Auto-Starting Rochester Import",
        description: "Automatically importing 5,555 trails near Rochester, MN...",
      });
      
      // Start Rochester import immediately
      setTimeout(() => {
        handleAutoRochesterImport();
      }, 500);
    }
  }, [progress.currentCount, rochesterAutoTriggered, isLoading]);

  const handleAutoRochesterImport = async () => {
    try {
      setRochesterImporting(true);
      
      console.log('🎯 Auto-starting Rochester import of 5,555 trails...');
      
      const success = await autoBootstrapService.forceRochesterImport();
      
      if (success) {
        toast({
          title: "🚀 Rochester Import Started",
          description: "Auto-importing 5,555 trails near Rochester, MN with location targeting",
        });
        
        // Start aggressive polling for updates
        const interval = setInterval(updateProgress, 2000);
        setTimeout(() => clearInterval(interval), 600000); // Stop after 10 minutes
      } else {
        toast({
          title: "❌ Auto-Import Failed",
          description: "Check console for detailed error report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auto Rochester import error:', error);
      toast({
        title: "💥 Auto-Import Error",
        description: "An error occurred during automatic Rochester import",
        variant: "destructive",
      });
    } finally {
      setRochesterImporting(false);
    }
  };

  const checkBootstrapStatus = async () => {
    try {
      setIsLoading(true);
      
      // Run diagnostics first
      const diagResult = await autoBootstrapService.runDiagnostics();
      setDiagnostics(diagResult);
      
      if (!diagResult.hasPermissions) {
        console.error('❌ Database permission issues:', diagResult.errors);
        toast({
          title: "🚨 Database Issues Detected",
          description: `Permission problems found: ${diagResult.errors.length} errors`,
          variant: "destructive",
        });
      }
      
      const result = await autoBootstrapService.checkAndBootstrap();
      
      console.log('Fixed bootstrap check result:', result);
      
      if (result.needed && result.triggered) {
        setBootstrapStatus('active');
        toast({
          title: "🔧 Fixed Schema Import Started",
          description: `Downloading 30K trails with corrected schema. Current: ${result.currentCount}`,
        });
      } else if (result.needed && !result.triggered) {
        setBootstrapStatus('needed');
      } else {
        setBootstrapStatus('complete');
      }
      
      // Update initial progress
      await updateProgress();
      
    } catch (error) {
      console.error('Error checking fixed bootstrap status:', error);
      setBootstrapStatus('needed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      const progressData = await autoBootstrapService.getBootstrapProgress();
      setProgress(progressData);
      
      // Update status based on progress
      if (progressData.isActive) {
        setBootstrapStatus('active');
      } else if (progressData.currentCount >= 25000) {
        setBootstrapStatus('complete');
      } else if (progressData.currentCount < 5000) {
        setBootstrapStatus('needed');
      }
      
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleFixedBootstrap = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "🔧 Starting Fixed Schema Import",
        description: "Using corrected database schema for reliable trail imports...",
      });
      
      const success = await autoBootstrapService.forceBootstrap();
      
      if (success) {
        setBootstrapStatus('active');
        toast({
          title: "🚀 Fixed Import Active",
          description: "Downloading 30K trails with corrected schema validation",
        });
        
        // Start aggressive polling for updates
        const interval = setInterval(updateProgress, 2000);
        setTimeout(() => clearInterval(interval), 600000); // Stop after 10 minutes
      } else {
        toast({
          title: "❌ Fixed Import Failed",
          description: "Check console for detailed error report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fixed bootstrap error:', error);
      toast({
        title: "💥 Import Error",
        description: "An error occurred during fixed import",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRochesterImport = async () => {
    try {
      setRochesterImporting(true);
      
      toast({
        title: "🎯 Starting Rochester Import",
        description: "Importing 5,555 trails near Rochester, MN...",
      });
      
      const success = await autoBootstrapService.forceRochesterImport();
      
      if (success) {
        toast({
          title: "🚀 Rochester Import Started",
          description: "Downloading 5,555 trails near Rochester, MN with location targeting",
        });
        
        // Start polling for updates
        const interval = setInterval(updateProgress, 2000);
        setTimeout(() => clearInterval(interval), 300000); // Stop after 5 minutes
      } else {
        toast({
          title: "❌ Rochester Import Failed",
          description: "Check console for detailed error report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Rochester import error:', error);
      toast({
        title: "💥 Rochester Import Error",
        description: "An error occurred during Rochester import",
        variant: "destructive",
      });
    } finally {
      setRochesterImporting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Auto Trail Import System
        </CardTitle>
        <CardDescription>
          Automatically importing 5,555 trails near Rochester, MN
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusBadge bootstrapStatus={bootstrapStatus} autoTriggered={autoTriggered} />
        
        <RochesterImportCard 
          onImport={handleRochesterImport}
          isImporting={rochesterImporting}
          isLoading={isLoading}
          autoTriggered={rochesterAutoTriggered}
        />

        <DiagnosticsCard diagnostics={diagnostics} />

        <ProgressSection progress={progress} bootstrapStatus={bootstrapStatus} />

        <ActionButtons 
          onFixedBootstrap={handleFixedBootstrap}
          onRefresh={updateProgress}
          isLoading={isLoading}
          autoTriggered={autoTriggered}
          bootstrapStatus={bootstrapStatus}
        />

        <StatusMessages 
          bootstrapStatus={bootstrapStatus}
          autoTriggered={autoTriggered}
          progress={progress}
        />
      </CardContent>
    </Card>
  );
}
