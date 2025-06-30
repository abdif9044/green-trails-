#!/usr/bin/env tsx
/**
 * Trigger Minnesota Regional Import
 * Imports trails within 300km radius of Minnesota
 */

import { QuickImportService } from '../src/services/trail-import/quick-import-service';

async function main() {
  console.log('🚀 Starting Minnesota Regional Import...');
  console.log('📍 Importing trails within 300km radius of Minnesota');
  console.log('🌲 Sources: Hiking Project, OpenStreetMap');
  console.log('⏱️ Estimated time: 10-20 minutes');
  console.log('');

  try {
    const result = await QuickImportService.importRegionalTrails('minnesota');

    console.log('\n🎉 Minnesota Import Complete!');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📊 Imported: ${result.imported} trails`);
    console.log(`❌ Failed: ${result.failed} trails`);
    console.log(`💬 Message: ${result.message}`);

    if (result.success && result.imported > 0) {
      console.log('\n🌲 Minnesota trails are now available in the database!');
    }

  } catch (error) {
    console.error('❌ Minnesota import failed:', error);
    process.exit(1);
  }
}

main();