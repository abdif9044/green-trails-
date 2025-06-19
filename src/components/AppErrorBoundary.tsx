
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('AppErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Check if this is a React hooks error
    if (error.message.includes('dispatcher') || error.message.includes('useCallback') || error.message.includes('useState')) {
      console.error('React hooks error detected - this might be caused by React not being properly initialized');
    }
  }

  private handleReload = () => {
    // Clear any cached state that might be causing issues
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('react-query-cache');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isReactHooksError = this.state.error?.message?.includes('dispatcher') || 
                               this.state.error?.message?.includes('useCallback') ||
                               this.state.error?.message?.includes('useState');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isReactHooksError 
                ? "There was an issue initializing the application. This might be a temporary problem."
                : "We encountered an unexpected error. Please try reloading the page."
              }
            </p>
            <button
              onClick={this.handleReload}
              className="bg-greentrail-600 text-white px-6 py-3 rounded-lg hover:bg-greentrail-700 transition-colors"
            >
              Reload Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-40 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
