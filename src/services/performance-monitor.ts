import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  id: string;
  component: string;
  operation: string;
  duration: number;
  timestamp: string;
  metadata?: any;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];

  static startTimer(component: string, operation: string) {
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.recordMetric(component, operation, duration);
        return duration;
      }
    };
  }

  static recordMetric(component: string, operation: string, duration: number, metadata?: any) {
    const metric: PerformanceMetric = {
      id: crypto.randomUUID(),
      component,
      operation,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log performance issues
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${component}.${operation} took ${duration}ms`);
    }

    // Try to save to database (gracefully handle if table doesn't exist)
    this.saveMetricToDatabase(metric).catch(error => {
      console.warn('Could not save performance metric to database:', error.message);
    });
  }

  private static async saveMetricToDatabase(metric: PerformanceMetric) {
    try {
      // Since performance_metrics table doesn't exist, just log the metric
      console.log('Performance metric (table not available):', metric);
      return;
    } catch (error) {
      console.warn('Performance metrics table not available:', error);
    }
  }

  static getMetrics() {
    return this.metrics;
  }

  static getAverageByOperation(component: string, operation: string) {
    const relevantMetrics = this.metrics.filter(
      m => m.component === component && m.operation === operation
    );
    
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / relevantMetrics.length;
  }

  static clearMetrics() {
    this.metrics = [];
  }
}
