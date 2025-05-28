import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MassiveImportConfig {
  totalTrails: number;
  sources: string[];
  batchSize: number;
  concurrency: number;
  geographicDistribution: {
    us: number;
    canada: number;
    mexico: number;
    global: number;
  };
}

interface ImportJobStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  source: string;
  country: string;
  trailsRequested: number;
  trailsProcessed: number;
  trailsAdded: number;
  trailsFailed: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export class MassiveTrailImportOrchestrator {
  private config: MassiveImportConfig;
  private activeJobs: ImportJobStatus[] = [];
  private totalProgress = 0;

  constructor() {
    this.config = {
      totalTrails: 30000, // Doubled from 15K to 30K
      sources: ['hiking_project', 'openstreetmap', 'usgs', 'parks_canada', 'inegi_mexico', 'trails_bc'],
      batchSize: 1000, // Increased for better performance
      concurrency: 4, // Increased concurrency
      geographicDistribution: {
        us: 15000,    // 50% US trails
        canada: 8000, // 27% Canadian trails  
        mexico: 4000, // 13% Mexican trails
        global: 3000  // 10% other/global trails
      }
    };
  }

  /**
   * Start the massive import process with 30,000 trails
   */
  async startMassiveImport(): Promise<{ success: boolean; jobId?: string }> {
    try {
      console.log('🚀 Starting massive import of 30,000 trails...');
      
      // Step 1: Verify and setup database
      await this.verifyDatabaseSetup();
      
      // Step 2: Create bulk import job
      const bulkJobId = await this.createBulkImportJob();
      
      // Step 3: Create individual import jobs for each region/source
      const importJobs = await this.createRegionalImportJobs(bulkJobId);
      
      // Step 4: Start parallel import execution
      await this.executeParallelImports(importJobs);
      
      toast.success(`Massive trail import started! Target: ${this.config.totalTrails.toLocaleString()} trails`);
      
      return { success: true, jobId: bulkJobId };
    } catch (error) {
      console.error('Failed to start massive import:', error);
      toast.error('Failed to start massive trail import');
      return { success: false };
    }
  }

  /**
   * Verify database is ready for massive import
   */
  private async verifyDatabaseSetup(): Promise<void> {
    console.log('🔍 Verifying database setup...');
    
    // Check if PostGIS functions exist
    const { data: postgisCheck, error } = await supabase
      .rpc('trails_within_radius', {
        center_lat: 44.9778,
        center_lng: -93.2650,
        radius_meters: 1000
      });
      
    if (error && error.message.includes('function does not exist')) {
      throw new Error('PostGIS functions not available. Database setup required.');
    }
    
    // Check bulk import tables exist
    const { error: bulkTableError } = await supabase
      .from('bulk_import_jobs')
      .select('id')
      .limit(1);
      
    if (bulkTableError && bulkTableError.code === '42P01') {
      throw new Error('Bulk import tables not found. Run database setup first.');
    }
    
    console.log('✅ Database setup verified');
  }

  /**
   * Create the main bulk import job
   */
  private async createBulkImportJob(): Promise<string> {
    const { data, error } = await supabase
      .from('bulk_import_jobs')
      .insert([{
        status: 'processing',
        started_at: new Date().toISOString(),
        total_trails_requested: this.config.totalTrails,
        total_sources: this.config.sources.length,
        trails_processed: 0,
        trails_added: 0,
        trails_updated: 0,
        trails_failed: 0
      }])
      .select('id')
      .single();
      
    if (error || !data) {
      throw new Error('Failed to create bulk import job');
    }
    
    return data.id;
  }

  /**
   * Create regional import jobs for 30K geographic distribution
   */
  private async createRegionalImportJobs(bulkJobId: string): Promise<ImportJobStatus[]> {
    const jobs: ImportJobStatus[] = [];
    
    // US Jobs (15,000 trails across multiple sources)
    jobs.push({
      id: 'us-hiking-project',
      status: 'queued',
      source: 'hiking_project',
      country: 'US',
      trailsRequested: 8000, // Premium US hiking trails
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    jobs.push({
      id: 'us-osm',
      status: 'queued',
      source: 'openstreetmap',
      country: 'US',
      trailsRequested: 4000, // OSM US trails
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    jobs.push({
      id: 'us-usgs',
      status: 'queued',
      source: 'usgs',
      country: 'US',
      trailsRequested: 3000, // Government trails
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    // Canada Jobs (8,000 trails)
    jobs.push({
      id: 'canada-osm',
      status: 'queued',
      source: 'openstreetmap',
      country: 'CA',
      trailsRequested: 4000,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    jobs.push({
      id: 'canada-parks',
      status: 'queued',
      source: 'parks_canada',
      country: 'CA',
      trailsRequested: 3000,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    jobs.push({
      id: 'canada-bc',
      status: 'queued',
      source: 'trails_bc',
      country: 'CA',
      trailsRequested: 1000,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    // Mexico Jobs (4,000 trails)
    jobs.push({
      id: 'mexico-osm',
      status: 'queued',
      source: 'openstreetmap',
      country: 'MX',
      trailsRequested: 2500,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    jobs.push({
      id: 'mexico-inegi',
      status: 'queued',
      source: 'inegi_mexico',
      country: 'MX',
      trailsRequested: 1500,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    // Global/Other (3,000 trails)
    jobs.push({
      id: 'global-osm',
      status: 'queued',
      source: 'openstreetmap',
      country: 'GLOBAL',
      trailsRequested: 3000,
      trailsProcessed: 0,
      trailsAdded: 0,
      trailsFailed: 0,
      startedAt: new Date().toISOString()
    });
    
    this.activeJobs = jobs;
    return jobs;
  }

  /**
   * Execute imports in parallel with controlled concurrency
   */
  private async executeParallelImports(jobs: ImportJobStatus[]): Promise<void> {
    console.log(`📊 Starting ${jobs.length} parallel import jobs...`);
    
    // Process jobs in batches to control concurrency
    for (let i = 0; i < jobs.length; i += this.config.concurrency) {
      const batch = jobs.slice(i, i + this.config.concurrency);
      
      const batchPromises = batch.map(job => this.executeImportJob(job));
      
      // Wait for current batch to complete before starting next
      await Promise.allSettled(batchPromises);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  /**
   * Execute a single import job
   */
  private async executeImportJob(job: ImportJobStatus): Promise<void> {
    try {
      console.log(`🎯 Starting import job: ${job.id} (${job.trailsRequested} trails from ${job.source})`);
      
      job.status = 'processing';
      
      // Call the enhanced import edge function
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: [job.source],
          maxTrailsPerSource: job.trailsRequested,
          batchSize: this.config.batchSize,
          concurrency: 2, // Lower concurrency per job
          country: job.country,
          priority: 'high'
        }
      });
      
      if (error) {
        throw error;
      }
      
      job.status = 'completed';
      job.trailsProcessed = data.total_processed || 0;
      job.trailsAdded = data.total_added || 0;
      job.trailsFailed = data.total_failed || 0;
      job.completedAt = new Date().toISOString();
      
      console.log(`✅ Completed ${job.id}: ${job.trailsAdded} trails added`);
      
    } catch (error) {
      console.error(`❌ Failed import job ${job.id}:`, error);
      job.status = 'error';
      job.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      job.completedAt = new Date().toISOString();
    }
  }

  /**
   * Get current import progress for 30K system
   */
  getProgress(): {
    totalJobs: number;
    completedJobs: number;
    totalTrailsRequested: number;
    totalTrailsAdded: number;
    totalTrailsFailed: number;
    progressPercent: number;
    jobs: ImportJobStatus[];
  } {
    const completedJobs = this.activeJobs.filter(job => 
      job.status === 'completed' || job.status === 'error'
    ).length;
    
    const totalTrailsRequested = this.activeJobs.reduce((sum, job) => sum + job.trailsRequested, 0);
    const totalTrailsAdded = this.activeJobs.reduce((sum, job) => sum + job.trailsAdded, 0);
    const totalTrailsFailed = this.activeJobs.reduce((sum, job) => sum + job.trailsFailed, 0);
    
    const progressPercent = Math.round((totalTrailsAdded / 30000) * 100);
    
    return {
      totalJobs: this.activeJobs.length,
      completedJobs,
      totalTrailsRequested,
      totalTrailsAdded,
      totalTrailsFailed,
      progressPercent,
      jobs: this.activeJobs
    };
  }

  /**
   * Quick start method for 30K trails
   */
  static async quickStart30KTrails(): Promise<{ success: boolean; jobId?: string }> {
    const orchestrator = new MassiveTrailImportOrchestrator();
    return await orchestrator.startMassiveImport();
  }
}
