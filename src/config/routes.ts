import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Home, Map, Compass, Users, Calendar, User, LogIn } from 'lucide-react';

export type AppRoute = {
  path: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<any>;
  auth?: boolean;
};

export const ROUTES: AppRoute[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/trails', label: 'Explore', icon: Compass },
  { path: '/map', label: 'Map', icon: Map },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/profile', label: 'Profile', icon: User, auth: true },
  { path: '/login', label: 'Sign In', icon: LogIn },
];
