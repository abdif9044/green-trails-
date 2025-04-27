
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle className="text-lg mb-2">Something went wrong</AlertTitle>
              <AlertDescription className="text-sm">
                <div className="mb-4">
                  {this.state.error?.message || "An unexpected error occurred"}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    onClick={this.resetErrorBoundary}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Go to home
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
