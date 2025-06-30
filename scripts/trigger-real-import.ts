#!/usr/bin/env tsx
/**
 * Trigger 200K+ Real Trails Import
 * Executes the production-grade import from USGS and NPS sources
 */

import { QuickImportService } from '../src/services/trail-import/quick-import-service';

async function main() {
  console.log('🚀 Starting 200K+ Real Trails Import...');
  console.log('📍 This will import authentic trail data from USGS and NPS government databases');
  console.log('⏱️ Estimated time: 30-60 minutes');
  console.log('');

  try {
    const result = await QuickImportService.import200KRealTrails((progress) => {
      if (progress.currentSource === 'complete') {
        console.log(`✅ ${progress.currentSource.toUpperCase()} - Processed: ${progress.processed}, Inserted: ${progress.inserted}, Updated: ${progress.updated}, Failed: ${progress.failed}`);
      } else {
        const sourceEmoji = progress.currentSource === 'usgs' ? '📍' : '🏞️';
        if (progress.totalBatches > 0) {
          const batchProgress = ((progress.currentBatch / progress.totalBatches) * 100).toFixed(1);
          console.log(`${sourceEmoji} ${progress.currentSource.toUpperCase()} [${progress.currentBatch}/${progress.totalBatches} batches, ${batchProgress}%] - Processed: ${progress.processed}, Inserted: ${progress.inserted}, Updated: ${progress.updated}, Failed: ${progress.failed}`);
        } else {
          console.log(`${sourceEmoji} ${progress.currentSource.toUpperCase()} - Initializing...`);
        }
      }
    });

    console.log('\n🎉 Real Trails Import Complete!');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📊 Imported: ${result.imported} trails`);
    console.log(`❌ Failed: ${result.failed} trails`);
    console.log(`💬 Message: ${result.message}`);
    
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

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();