
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingFallback from '@/components/LoadingFallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
          <Toaster />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
