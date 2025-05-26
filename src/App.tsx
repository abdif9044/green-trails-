
import React, { useState } from 'react';
import { ToastProvider } from './components/ToastProvider';
import { AppErrorBoundary } from './components/AppErrorBoundary';
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
    <AppErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
