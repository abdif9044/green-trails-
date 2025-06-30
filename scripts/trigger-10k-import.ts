#!/usr/bin/env tsx
/**
 * Trigger Quick 10K Import
 * Tests the import system with 10,000 sample trails
 */

import { supabase } from '../src/integrations/supabase/client';

async function main() {
  console.log('🚀 Starting Quick 10K Import Test...');
  console.log('📍 This will import 10,000 sample trails for testing');
  console.log('⏱️ Estimated time: 5-10 minutes');
  console.log('');

  try {
    // Trigger the bootstrap function for immediate 10K import
    const { data, error } = await supabase.functions.invoke('bootstrap-trail-database', {
      body: {
        immediate: true,
        target: '10K'
      }
    });

    if (error) {
      throw error;
    }

    console.log('✅ Import request sent successfully!');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
    if (data.job_id) {
      console.log('\n🔄 Monitoring import progress...');
      
      // Monitor progress
      let completed = false;
      while (!completed) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const { data: job, error: jobError } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', data.job_id)
          .single();

        if (!jobError && job) {
          const progress = job.total_trails_requested > 0 
            ? Math.round((job.trails_processed / job.total_trails_requested) * 100)
            : 0;

          console.log(`📈 Progress: ${progress}% - Added: ${job.trails_added || 0}, Processed: ${job.trails_processed || 0}, Failed: ${job.trails_failed || 0}`);
          
          if (job.status === 'completed' || job.status === 'error') {
            completed = true;
            console.log(`\n🎉 Import ${job.status}!`);
            console.log(`✅ Final Results:`);
            console.log(`   - Trails Added: ${job.trails_added || 0}`);
            console.log(`   - Trails Processed: ${job.trails_processed || 0}`);
            console.log(`   - Trails Failed: ${job.trails_failed || 0}`);
            
            if (job.status === 'error') {
              console.log(`❌ Error: ${job.error_message || 'Unknown error'}`);
            }
          }
        } else {
          console.log('⏳ Checking job status...');
        }
      }
    }

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();