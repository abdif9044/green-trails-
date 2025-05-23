
import React, { useState } from 'react';
import { useAuth } from './hooks/use-auth';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import './App.css';
import AppRoutes from './routes';

function App() {
  const { user } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <SplashScreen onFinished={() => setSplashFinished(true)} />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider />
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
