/**
 * Production Error Reporting and Analytics
 * Simple crash reporting for production monitoring
 */

interface ErrorData {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
}

class ErrorReporter {
  private userId?: string;
  private isProduction = import.meta.env.PROD;

  setUserId(userId: string) {
    this.userId = userId;
  }

  reportError(error: Error, context?: Record<string, any>) {
    if (!this.isProduction) {
      console.error('Development Error:', error, context);
      return;
    }

    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      userId: this.userId
    };

    // Send to your error reporting service
    this.sendErrorReport(errorData, context);
  }

  reportUnhandledError() {
    window.addEventListener('error', (event) => {
      this.reportError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), {
        type: 'unhandledPromiseRejection'
      });
    });
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isProduction) {
      console.log('Analytics Event:', event, properties);
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.userId
    };

    this.sendAnalyticsEvent(analyticsEvent);
  }

  private async sendErrorReport(errorData: ErrorData, context?: Record<string, any>) {
    try {
      // For now, log to console in production
      // Replace with actual error reporting service (Sentry, LogRocket, etc.)
      console.error('Production Error:', errorData, context);
      
      // You can integrate with services like:
      // - Sentry: Sentry.captureException(error)
      // - LogRocket: LogRocket.captureException(error)
      // - Custom endpoint: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private async sendAnalyticsEvent(event: AnalyticsEvent) {
    try {
      // For now, log to console in production
      // Replace with actual analytics service
      console.log('Analytics:', event);
      
      // You can integrate with services like:
      // - Google Analytics 4: gtag('event', event.event, event.properties)
      // - Mixpanel: mixpanel.track(event.event, event.properties)
      // - Custom endpoint: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) })
    } catch (analyticsError) {
      console.error('Failed to send analytics:', analyticsError);
    }
  }
}

export const errorReporter = new ErrorReporter();

// Initialize unhandled error reporting
errorReporter.reportUnhandledError();