
import { lazy } from 'react';

// Lazy load components without any Router wrappers
export const LazyTrail = lazy(() => import('@/pages/TrailDetailPage'));
export const LazyDiscover = lazy(() => import('@/pages/Discover'));
export const LazySocial = lazy(() => import('@/pages/Social'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyAdminTrailImport = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
export const LazyAlbumDetail = lazy(() => import('@/pages/AlbumDetail'));
export const LazyCreateAlbum = lazy(() => import('@/pages/CreateAlbum'));
export const LazyBadges = lazy(() => import('@/pages/Badges'));
export const LazyAutoImportPage = lazy(() => import('@/pages/AutoImportPage'));
export const LazyAdminTrailImportFeature = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
