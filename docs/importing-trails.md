# GreenTrails Trail Data Import Guide

This document explains how to import real trail data from authoritative US government sources into GreenTrails.

## Overview

GreenTrails imports trail data from two primary authoritative sources:
- **USGS** (United States Geological Survey) - National Digital Trails dataset
- **NPS** (National Park Service) - National park trails via ArcGIS Hub

The import system is designed to reliably ingest 200,000+ trails while maintaining data integrity and avoiding duplicates.

## Data Sources

### USGS National Digital Trails
- **Source**: USGS ArcGIS REST Services
- **Endpoint**: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Recreation_Trails/FeatureServer/0`
- **Coverage**: Nationwide US trails including state parks, national forests, and local trail systems
- **Expected Count**: ~100,000-150,000 trails
- **Data Quality**: High - authoritative government data with detailed attributes

### NPS National Park Service Trails
- **Source**: NPS via ArcGIS Hub
- **Endpoint**: `https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_-_Trails/FeatureServer/0`
- **Coverage**: All US National Parks and monuments
- **Expected Count**: ~30,000-50,000 trails
- **Data Quality**: Highest - official National Park Service data

## Trail Schema

The unified trail schema used for all imports:

```typescript
interface Trail {
  id: string;                 // Unique identifier
  name: string;              // Trail name
  length_km: number;         // Length in kilometers
  difficulty: 'easy' | 'moderate' | 'hard';
  latitude: number;          // WGS84 latitude
  longitude: number;         // WGS84 longitude
  geojson?: any;            // Full trail geometry
  description?: string;      // Trail description
  elevation_gain?: number;   // Elevation gain in meters
  location: string;          // Location/region name
  source: 'USGS' | 'NPS';   // Data source
}
```

## Database Setup

The import system uses PostgreSQL with PostGIS extensions:

```sql
-- Geometry column for spatial queries
ALTER TABLE trails ADD COLUMN geom geometry(LineString, 4326);

-- Spatial index for fast geographic queries
CREATE INDEX idx_trails_geom ON trails USING GIST(geom);

-- Source-based indexes for filtering
CREATE INDEX idx_trails_source ON trails(source);
```

## Import Process

### 1. Idempotency Check
Before importing, the system checks existing data:
- USGS: Skip if >50,000 trails already exist from USGS source
- NPS: Skip if >10,000 trails already exist from NPS source

### 2. Data Fetching
- USGS: Fetches in 1,000-trail chunks with rate limiting
- NPS: Fetches in 1,000-trail chunks with rate limiting
- All data is validated and transformed to unified schema

### 3. Bulk Insert
- Uses PostgreSQL `bulk_insert_trails()` function for efficiency
- Processes in 10,000-trail batches
- Handles conflicts by updating existing trails (upsert)
- Includes exponential backoff retry logic

### 4. Verification
After import, the system verifies:
- Total trail count
- Data integrity (non-null names and coordinates)
- Spatial index functionality

## Usage

### Web Interface
1. Navigate to `/admin/trail-import`
2. Click "Import Real Trails" button
3. Monitor progress in real-time
4. View completion status and statistics

### CLI Script
```bash
# Install dependencies
npm install

# Set environment variables
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-anon-key"

# Run import
npx tsx scripts/import-trails.ts

# Or using npm script
npm run import-trails
```

### Programmatic Usage
```typescript
import { RealTrailsImportService } from './services/trail-import/real-trails-import-service';

const result = await RealTrailsImportService.importRealTrails(
  (progress) => {
    console.log(`Progress: ${progress.processed} trails processed`);
  }
);

console.log(`Import complete: ${result.total_inserted} trails added`);
```

## Performance Characteristics

### Supabase Free Tier
- **Execution Time**: 2-5 minutes for full import
- **Memory Usage**: <100MB peak
- **Database Calls**: ~20-50 RPC calls (batched efficiently)
- **Rate Limits**: Respects Supabase rate limits with backoff

### Production Considerations
- **Bundle Size**: Import services are lazy-loaded to avoid affecting app bundle
- **Error Handling**: Graceful degradation if import fails
- **Progress Tracking**: Real-time progress updates via callbacks
- **Retry Logic**: Exponential backoff for transient failures

## Re-running Imports

The import system is designed for safe re-runs:

1. **Idempotency**: Won't duplicate existing data
2. **Upserts**: Updates existing trails if data has changed
3. **Source Tracking**: Maintains source attribution for data integrity
4. **Rollback Safety**: Can be safely interrupted and restarted

### Manual Re-run Steps
1. Check current trail count: `SELECT COUNT(*) FROM trails;`
2. Optionally clear specific source: `DELETE FROM trails WHERE source = 'USGS';`
3. Run import process again
4. Verify final count meets expectations (≥200,000 trails)

## Troubleshooting

### Common Issues

**"RPC error: function does not exist"**
- Solution: Run the database migration to create `bulk_insert_trails()` function

**"Rate limit exceeded"**
- Solution: Import system includes automatic retry with exponential backoff

**"Geometry errors"**
- Solution: Import system validates and repairs common geometry issues

**"Import stalls or times out"**
- Solution: Restart import - it will resume from where it left off

### Verification Queries

```sql
-- Check total trail count by source
SELECT source, COUNT(*) as count 
FROM trails 
WHERE source IS NOT NULL 
GROUP BY source;

-- Verify spatial data integrity
SELECT COUNT(*) as trails_with_geometry 
FROM trails 
WHERE geom IS NOT NULL;

-- Check for duplicates
SELECT name, location, COUNT(*) as duplicates 
FROM trails 
GROUP BY name, location 
HAVING COUNT(*) > 1;
```

## GitHub Actions Automation

The repository includes a GitHub Action for automated trail imports:

```yaml
# .github/workflows/import-trails.yml
name: Import Trail Data
on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '0 2 * * 0' # Weekly at 2 AM Sunday

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx tsx scripts/import-trails.ts
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Data Licensing

Both USGS and NPS data are in the public domain:
- **USGS**: Public domain US government data
- **NPS**: Public domain National Park Service data

No special licensing or attribution is required, but it's good practice to acknowledge the data sources in your application.