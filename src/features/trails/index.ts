
// Re-export components for easy import
export { default as TrailCard } from './components/TrailCard';
export { default as TrailCardPrefetch } from './components/TrailCardPrefetch';
export { TrailCardStats } from './components/TrailCardStats';
export { TrailDifficultyBadge } from './components/TrailDifficultyBadge';
export { TrailTagsList } from './components/TrailTagsList';

// Re-export hooks
export { useTrails } from './hooks/use-trails';
export { useTrail } from './hooks/use-trail';
export { useTrailFilters } from './hooks/use-trail-filters';
export { validateDifficulty, formatTrailData } from './hooks/use-trail-query-base';

// Re-export types
export type { Trail, TrailFilters, TrailDifficulty, StrainTag } from '@/types/trails';
