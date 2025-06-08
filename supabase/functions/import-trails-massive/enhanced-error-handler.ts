
export interface ErrorContext {
  operation: string;
  batchIndex?: number;
  trailData?: any;
  timestamp: string;
}

export class EnhancedErrorHandler {
  private errors: Array<{ context: ErrorContext; error: Error }> = [];
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  logError(context: ErrorContext, error: Error) {
    this.errors.push({ context, error });
    console.error(`[${context.operation}] Error:`, {
      ...context,
      message: error.message,
      stack: error.stack
    });
  }

  shouldRetry(operationKey: string): boolean {
    const attempts = this.retryAttempts.get(operationKey) || 0;
    if (attempts < this.maxRetries) {
      this.retryAttempts.set(operationKey, attempts + 1);
      return true;
    }
    return false;
  }

  async withRetry<T>(
    operationKey: string,
    operation: () => Promise<T>,
    context: ErrorContext
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.logError(context, error as Error);
      
      if (this.shouldRetry(operationKey)) {
        console.log(`Retrying operation: ${operationKey}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.withRetry(operationKey, operation, context);
      }
      
      return null;
    }
  }

  getErrorSummary() {
    const errorTypes = new Map<string, number>();
    this.errors.forEach(({ error }) => {
      const type = error.constructor.name;
      errorTypes.set(type, (errorTypes.get(type) || 0) + 1);
    });

    return {
      totalErrors: this.errors.length,
      errorTypes: Object.fromEntries(errorTypes),
      recentErrors: this.errors.slice(-5).map(({ context, error }) => ({
        operation: context.operation,
        message: error.message,
        timestamp: context.timestamp
      }))
    };
  }

  reset() {
    this.errors = [];
    this.retryAttempts.clear();
  }
}
