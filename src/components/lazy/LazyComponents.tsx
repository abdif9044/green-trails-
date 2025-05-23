
import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyTrail = lazy(() => import('@/pages/Trail'));
export const LazyDiscover = lazy(() => import('@/pages/Discover'));
export const LazySocial = lazy(() => import('@/pages/Social'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyAdminTrailImport = lazy(() => import('@/pages/AdminTrailImport'));
export const LazyAlbumDetail = lazy(() => import('@/pages/AlbumDetail'));
export const LazyCreateAlbum = lazy(() => import('@/pages/CreateAlbum'));
export const LazyBadges = lazy(() => import('@/pages/Badges'));
export const LazyAutoImportPage = lazy(() => import('@/pages/AutoImportPage'));

// Lazy load admin components
export const LazyAdminTrailImportFeature = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
