#!/usr/bin/env tsx
/**
 * CLI Trail Import Script for GreenTrails
 * Imports real trail data from USGS and NPS sources for local/development use
 * 
 * Usage:
 *   npx tsx scripts/import-trails.ts
 *   npm run import-trails
 */

import { createClient } from '@supabase/supabase-js';
import { RealTrailsImportService, type ImportProgress } from '../src/services/trail-import/real-trails-import-service';

// Environment setup
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

if (!SUPABASE_URL.includes('supabase.co') || !SUPABASE_ANON_KEY.startsWith('eyJ')) {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Progress tracking
let lastProgress: ImportProgress | null = null;

function formatProgress(progress: ImportProgress): string {
  const { currentSource, currentBatch, totalBatches, processed, inserted, updated, failed } = progress;
  
  if (currentSource === 'complete') {
    return `✅ Import complete! Processed: ${processed}, Inserted: ${inserted}, Updated: ${updated}, Failed: ${failed}`;
  }
  
  const sourceEmoji = currentSource === 'usgs' ? '📍' : '🏞️';
  const sourceName = currentSource.toUpperCase();
  
  if (totalBatches > 0) {
    const batchProgress = ((currentBatch / totalBatches) * 100).toFixed(1);
    return `${sourceEmoji} ${sourceName} [${currentBatch}/${totalBatches} batches, ${batchProgress}%] - Processed: ${processed}, Inserted: ${inserted}, Updated: ${updated}, Failed: ${failed}`;
  } else {
    return `${sourceEmoji} ${sourceName} - Initializing...`;
  }
}

function onProgress(progress: ImportProgress): void {
  const progressStr = formatProgress(progress);
  
  // Only log if progress changed significantly
  if (!lastProgress || 
      lastProgress.currentSource !== progress.currentSource ||
      lastProgress.currentBatch !== progress.currentBatch ||
      (progress.processed - lastProgress.processed) >= 1000) {
    console.log(progressStr);
    lastProgress = progress;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting GreenTrails real trail import...');
  console.log(`📡 Connecting to: ${SUPABASE_URL}`);
  
  const startTime = Date.now();
  
  try {
    // Test connection
    const { error: connectionError } = await supabase.from('trails').select('count').limit(1);
    if (connectionError) {
      throw new Error(`Database connection failed: ${connectionError.message}`);
    }
    console.log('✅ Database connection established');

    // Check current status
    const status = await RealTrailsImportService.getImportStatus();
    console.log(`📊 Current database status: ${status.totalTrails} trails`);
    
    if (status.sourceBreakdown) {
      Object.entries(status.sourceBreakdown).forEach(([source, count]) => {
        console.log(`   - ${source}: ${count} trails`);
      });
    }

    // Start import
    console.log('\n🔄 Starting real trail data import...');
    const result = await RealTrailsImportService.importRealTrails(onProgress);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log('\n📈 Import Results:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Total Inserted: ${result.total_inserted}`);
    console.log(`   Total Updated: ${result.total_updated}`);
    console.log(`   Total Failed: ${result.total_failed}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Message: ${result.message}`);
    
    if (result.sources) {
      console.log('\n📍 USGS Results:');
      console.log(`   Inserted: ${result.sources.usgs.inserted}`);
      console.log(`   Updated: ${result.sources.usgs.updated}`);
      console.log(`   Failed: ${result.sources.usgs.failed}`);
      
      console.log('\n🏞️ NPS Results:');
      console.log(`   Inserted: ${result.sources.nps.inserted}`);
      console.log(`   Updated: ${result.sources.nps.updated}`);
      console.log(`   Failed: ${result.sources.nps.failed}`);
    }

    // Final status check
    const finalStatus = await RealTrailsImportService.getImportStatus();
    console.log(`\n✅ Final database count: ${finalStatus.totalTrails} trails`);
    
    if (result.success && finalStatus.totalTrails >= 200000) {
      console.log('🎉 Import target achieved! Database now contains 200K+ trails.');
    } else if (result.success) {
      console.log(`⚠️ Import successful but target not reached. Consider running additional imports.`);
    } else {
      console.error('❌ Import failed. Check logs above for details.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Import failed with error:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Import interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Import terminated');
  process.exit(0);
});

// Run the import
main().catch((error) => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});