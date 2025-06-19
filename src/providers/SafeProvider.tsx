
import React, { Component, ReactNode } from 'react';
import { ensureReactReady } from '@/utils/react-safety';

interface SafeProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface SafeProviderState {
  hasError: boolean;
  isReactReady: boolean;
}

export class SafeProvider extends Component<SafeProviderProps, SafeProviderState> {
  private checkTimer: NodeJS.Timeout | null = null;

  constructor(props: SafeProviderProps) {
    super(props);
    this.state = {
      hasError: false,
      isReactReady: ensureReactReady()
    };
  }

  static getDerivedStateFromError(): SafeProviderState {
    return { hasError: true, isReactReady: false };
  }

  componentDidMount() {
    if (!this.state.isReactReady) {
      // Try to wait for React to be ready
      this.checkTimer = setInterval(() => {
        if (ensureReactReady()) {
          this.setState({ isReactReady: true });
          if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
          }
        }
      }, 100);

      // Give up after 5 seconds
      setTimeout(() => {
        if (this.checkTimer) {
          clearInterval(this.checkTimer);
          this.checkTimer = null;
        }
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  componentDidCatch(error: Error) {
    console.error(`SafeProvider (${this.props.name || 'unknown'}) caught error:`, error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p className="text-red-600">Something went wrong loading {this.props.name || 'this component'}.</p>
        </div>
      );
    }

    if (!this.state.isReactReady) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p>Loading...</p>
        </div>
      );
    }

    return this.props.children;
  }
}
