
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import AppErrorBoundary from './components/AppErrorBoundary.tsx'

// Ensure React is available globally and properly initialized
if (typeof window !== 'undefined') {
  (window as any).React = React;
  
  // Add a small delay to ensure React is fully loaded
  const ensureReactReady = () => {
    return new Promise<void>((resolve) => {
      if (React && React.useState && React.useEffect) {
        resolve();
      } else {
        setTimeout(() => {
          ensureReactReady().then(resolve);
        }, 10);
      }
    });
  };

  // Wait for React to be ready before creating the app
  ensureReactReady().then(() => {
    console.log('React is ready, initializing app...');
    initializeApp();
  });
} else {
  // Server-side or non-browser environment
  initializeApp();
}

function initializeApp() {
  // Create a client for React Query with optimized settings
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
      },
    },
  });

  // Register service worker for better performance
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);

  // Auto-bootstrap runs when app starts - no user action needed
  import('./hooks/use-auto-trail-bootstrap').then(({ useAutoTrailBootstrap }) => {
    console.log('🚀 Auto trail bootstrap system loaded');
  }).catch(error => {
    console.warn('Auto trail bootstrap failed to load:', error);
  });

  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}
