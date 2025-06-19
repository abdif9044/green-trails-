
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import TrailDetail from '@/pages/TrailDetail';
import WeatherProphet from '@/pages/WeatherProphet';
import Social from '@/pages/Social';
import Profile from '@/pages/Profile';
import Badges from '@/pages/Badges';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import AdminPanel from '@/pages/AdminPanel';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import { AuthProvider } from '@/providers/auth-provider';

// Wrapper component to provide auth context to routes that need it
const AuthProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/trail/:id" element={
            <AuthProtectedRoute>
              <TrailDetail />
            </AuthProtectedRoute>
          } />
          <Route path="/weather-prophet" element={<WeatherProphet />} />
          <Route path="/social" element={
            <AuthProtectedRoute>
              <Social />
            </AuthProtectedRoute>
          } />
          <Route path="/profile" element={
            <AuthProtectedRoute>
              <Profile />
            </AuthProtectedRoute>
          } />
          <Route path="/badges" element={
            <AuthProtectedRoute>
              <Badges />
            </AuthProtectedRoute>
          } />
          <Route path="/settings" element={
            <AuthProtectedRoute>
              <Settings />
            </AuthProtectedRoute>
          } />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminPanel />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
