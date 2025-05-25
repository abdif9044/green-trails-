
import React, { useState } from 'react';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import { AuthProvider } from '@/providers/auth-provider';
import AppRoutes from './routes';
import './App.css';

function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <SplashScreen onFinished={() => setSplashFinished(true)} />;
  }

  return (
    <AuthProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
