
import { TrailTemplate, ImportResult, PhaseResult } from './types.ts';
import { BatchProcessor } from './batch-processor.ts';
import { TrailGenerator } from './trail-generator.ts';
import { ImportMonitor } from './monitor.ts';
import { DatabaseFoundationFixer } from './database-fixer.ts';

export class AutonomousImportOrchestrator {
  private supabase: any;
  private targetTrails: number;
  private monitor: ImportMonitor;
  private batchProcessor: BatchProcessor;
  private trailGenerator: TrailGenerator;
  private dbFixer: DatabaseFoundationFixer;
  
  constructor(supabase: any, targetTrails: number = 55555) {
    this.supabase = supabase;
    this.targetTrails = targetTrails;
    this.monitor = new ImportMonitor(supabase);
    this.batchProcessor = new BatchProcessor(supabase);
    this.trailGenerator = new TrailGenerator();
    this.dbFixer = new DatabaseFoundationFixer(supabase);
  }
  
  async executeAutonomousImport(): Promise<ImportResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting autonomous import of ${this.targetTrails} trails`);
    
    const result: ImportResult = {
      success: false,
      message: '',
      jobId: crypto.randomUUID(),
      trailsImported: 0,
      timeElapsed: 0,
      phases: []
    };
    
    try {
      // Create bulk import job record
      await this.createBulkImportJob(result.jobId!);
      
      // Phase 1: Database Health Check
      await this.executePhase1(result);
      
      // Phase 2: Generate Trails  
      await this.executePhase2(result);
      
      // Phase 3: Batch Import
      await this.executePhase3(result);
      
      // Phase 4: Validation
      await this.executePhase4(result);
      
      result.success = true;
      result.message = `Successfully imported ${result.trailsImported} trails`;
      
    } catch (error) {
      console.error('💥 Autonomous import failed:', error);
      result.success = false;
      result.message = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    
    result.timeElapsed = Date.now() - startTime;
    await this.updateBulkImportJob(result.jobId!, result);
    
    return result;
  }
  
  private async createBulkImportJob(jobId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bulk_import_jobs')
        .insert({
          id: jobId,
          status: 'processing',
          total_trails_requested: this.targetTrails,
          total_sources: 1,
          started_at: new Date().toISOString()
        });
      
      if (error) {
        console.warn('Failed to create bulk import job record:', error);
      }
    } catch (error) {
      console.warn('Error creating bulk import job:', error);
    }
  }
  
  private async updateBulkImportJob(jobId: string, result: ImportResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bulk_import_jobs')
        .update({
          status: result.success ? 'completed' : 'error',
          completed_at: new Date().toISOString(),
          trails_processed: result.trailsImported,
          trails_added: result.trailsImported,
          trails_failed: Math.max(0, this.targetTrails - result.trailsImported),
          last_updated: new Date().toISOString()
        })
        .eq('id', jobId);
      
      if (error) {
        console.warn('Failed to update bulk import job:', error);
      }
    } catch (error) {
      console.warn('Error updating bulk import job:', error);
    }
  }
  
  private async executePhase1(result: ImportResult): Promise<void> {
    console.log('🔧 Phase 1: Database Health Check');
    const phaseStart = Date.now();
    
    try {
      await this.dbFixer.fixAllFoundations();
      
      const currentCount = await this.monitor.getCurrentTrailCount();
      console.log(`📊 Current trail count: ${currentCount}`);
      
      result.phases.push({
        phase: 'Database Health Check',
        success: true,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: []
      });
      
    } catch (error) {
      result.phases.push({
        phase: 'Database Health Check',
        success: false,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
      throw error;
    }
  }
  
  private async executePhase2(result: ImportResult): Promise<void> {
    console.log('🎯 Phase 2: Trail Generation');
    const phaseStart = Date.now();
    
    try {
      const trails = await this.trailGenerator.generateTrails(this.targetTrails);
      console.log(`✅ Generated ${trails.length} trail templates`);
      
      result.phases.push({
        phase: 'Trail Generation',
        success: true,
        trailsProcessed: trails.length,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: []
      });
      
      // Store trails for next phase
      (result as any).generatedTrails = trails;
      
    } catch (error) {
      result.phases.push({
        phase: 'Trail Generation',
        success: false,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
      throw error;
    }
  }
  
  private async executePhase3(result: ImportResult): Promise<void> {
    console.log('📦 Phase 3: Batch Import');
    const phaseStart = Date.now();
    
    try {
      const trails = (result as any).generatedTrails as TrailTemplate[];
      if (!trails || trails.length === 0) {
        throw new Error('No trails available for import');
      }
      
      const batchResult = await this.batchProcessor.processBatches(
        trails,
        100, // batchSize
        2    // concurrency
      );
      
      result.trailsImported = batchResult.totalAdded;
      
      result.phases.push({
        phase: 'Batch Import',
        success: batchResult.totalFailed === 0,
        trailsProcessed: batchResult.totalProcessed,
        trailsAdded: batchResult.totalAdded,
        trailsFailed: batchResult.totalFailed,
        duration: Date.now() - phaseStart,
        errors: batchResult.errors
      });
      
    } catch (error) {
      result.phases.push({
        phase: 'Batch Import',
        success: false,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: this.targetTrails,
        duration: Date.now() - phaseStart,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
      throw error;
    }
  }
  
  private async executePhase4(result: ImportResult): Promise<void> {
    console.log('✅ Phase 4: Validation');
    const phaseStart = Date.now();
    
    try {
      const validation = await this.monitor.validateImportQuality();
      
      result.phases.push({
        phase: 'Validation',
        success: validation.valid,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: validation.issues
      });
      
      if (!validation.valid) {
        console.warn('⚠️ Import quality issues detected:', validation.issues);
      }
      
    } catch (error) {
      result.phases.push({
        phase: 'Validation',
        success: false,
        trailsProcessed: 0,
        trailsAdded: 0,
        trailsFailed: 0,
        duration: Date.now() - phaseStart,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
      // Don't throw error here - validation failure shouldn't stop the import
    }
  }
}
