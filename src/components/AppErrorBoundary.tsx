
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
                alt="GreenTrails Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, we're working on fixing it.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-greentrail-600 hover:bg-greentrail-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  window.location.href = '/';
                }}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
