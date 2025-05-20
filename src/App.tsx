
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import Trail from './pages/Trail';
import Discover from './pages/Discover';
import Social from './pages/Social';
import Profile from './pages/Profile';
import AdminTrailImport from './pages/AdminTrailImport';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';
import AlbumDetail from './pages/AlbumDetail';
import CreateAlbum from './pages/CreateAlbum';
import AdminRedirect from './pages/AdminRedirect';
import AdminImportGuidePage from './pages/AdminImportGuidePage';
import { ToastProvider } from './components/ToastProvider';
import SplashScreen from './components/SplashScreen';
import Badges from './pages/Badges';
import AutoImport from './pages/AutoImport';
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
