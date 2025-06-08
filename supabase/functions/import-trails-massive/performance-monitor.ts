
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  private startTimes = new Map<string, number>();

  startTimer(operation: string): void {
    this.startTimes.set(operation, Date.now());
  }

  endTimer(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    const existing = this.metrics.get(operation) || [];
    existing.push(duration);
    this.metrics.set(operation, existing);
    this.startTimes.delete(operation);
    
    return duration;
  }

  getMetrics() {
    const summary: Record<string, any> = {};
    
    this.metrics.forEach((durations, operation) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      summary[operation] = {
        count: durations.length,
        average: Math.round(avg),
        min,
        max,
        total: durations.reduce((a, b) => a + b, 0)
      };
    });
    
    return summary;
  }

  reset() {
    this.metrics.clear();
    this.startTimes.clear();
  }
}
