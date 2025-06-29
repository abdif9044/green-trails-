
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  metric_name: string;
  value: number;
  metadata?: Record<string, any>;
  user_id?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  constructor() {
    this.startPerformanceObserver();
    this.startBatchFlush();
  }

  // Track core web vitals and app performance
  private startPerformanceObserver() {
    if (typeof window === 'undefined') return;

    // Track page load times
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackMetric('page_load_time', loadTime);
    });

    // Track largest contentful paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackMetric('largest_contentful_paint', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  public trackMetric(name: string, value: number, metadata?: Record<string, any>, userId?: string) {
    this.metrics.push({
      metric_name: name,
      value,
      metadata,
      user_id: userId
    });

    if (this.metrics.length >= this.batchSize) {
      this.flushMetrics();
    }
  }

  public trackUserEngagement(action: string, context?: Record<string, any>) {
    this.trackMetric('user_engagement', 1, {
      action,
      timestamp: new Date().toISOString(),
      ...context
    });
  }

  public trackTrailInteraction(trailId: string, action: 'view' | 'like' | 'comment' | 'share') {
    this.trackMetric('trail_interaction', 1, {
      trail_id: trailId,
      action,
      timestamp: new Date().toISOString()
    });
  }

  private async flushMetrics() {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      // For now, just log metrics since performance_metrics table doesn't exist
      console.log('Performance metrics:', metricsToSend);
      
      // TODO: Once performance_metrics table is created, uncomment this:
      // const { error } = await supabase
      //   .from('performance_metrics')
      //   .insert(metricsToSend);
      //
      // if (error) {
      //   console.error('Failed to send performance metrics:', error);
      //   // Re-add metrics to queue for retry
      //   this.metrics.unshift(...metricsToSend);
      // }
    } catch (error) {
      console.error('Error sending performance metrics:', error);
    }
  }

  private startBatchFlush() {
    setInterval(() => {
      this.flushMetrics();
    }, this.flushInterval);
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
