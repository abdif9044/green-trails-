import React, { useState } from 'react';
import { useAuth } from './hooks/use-auth';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import AppRoutes from './routes';

function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <SplashScreen onFinished={() => setSplashFinished(true)} />;
  }

  return (
    <AuthProvider>
      <ErrorBoundary>
        <ToastProvider />
        <AppRoutes />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
