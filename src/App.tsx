
import React, { useState } from 'react';
import { useAuth } from './hooks/use-auth';
import { ToastProvider } from './components/ToastProvider';
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
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
