
import { AutonomousImportConfig, ImportResult, ImportPhase, PhaseResult, TrailTemplate } from './types.ts';
import { DatabaseFoundationFixer } from './database-fixer.ts';
import { ImportMonitor } from './monitor.ts';
import { TrailDataGenerator } from './trail-generator.ts';
import { BatchProcessor } from './batch-processor.ts';

export class AutonomousImportOrchestrator {
  private supabase: any;
  private config: AutonomousImportConfig;
  private monitor: ImportMonitor;
  private startTime: number;
  
  constructor(supabase: any, targetTrails: number = 55555) {
    this.supabase = supabase;
    this.startTime = Date.now();
    this.config = {
      targetTrails,
      maxRetries: 3,
      batchSize: 500,
      concurrency: 4,
      autoHeal: true,
      monitoringInterval: 5000,
      phases: [
        {
          name: 'Foundation Test',
          trailCount: 1000,
          batchSize: 100,
          concurrency: 2,
          successThreshold: 0.95,
          autoRetry: true
        },
        {
          name: 'Scale Test',
          trailCount: 5000,
          batchSize: 200,
          concurrency: 3,
          successThreshold: 0.90,
          autoRetry: true
        },
        {
          name: 'Volume Test',
          trailCount: 15000,
          batchSize: 400,
          concurrency: 4,
          successThreshold: 0.85,
          autoRetry: true
        },
        {
          name: 'Full Import',
          trailCount: targetTrails,
          batchSize: 500,
          concurrency: 5,
          successThreshold: 0.80,
          autoRetry: true
        }
      ]
    };
    this.monitor = new ImportMonitor(supabase);
  }

  async executeAutonomousImport(): Promise<ImportResult> {
    console.log(`🎯 Starting autonomous import of ${this.config.targetTrails} trails`);
    
    const phases: PhaseResult[] = [];
    let totalImported = 0;
    
    try {
      // Phase 1: Fix database foundations
      console.log('🔧 Phase 1: Fixing database foundations...');
      const foundationFixer = new DatabaseFoundationFixer(this.supabase);
      await foundationFixer.fixAllFoundations();
      
      // Phase 2: Execute staged import phases
      for (const phase of this.config.phases) {
        console.log(`🚀 Starting phase: ${phase.name} (${phase.trailCount} trails)`);
        
        const phaseResult = await this.executePhase(phase);
        phases.push(phaseResult);
        totalImported += phaseResult.trailsAdded;
        
        // Check if phase failed and should stop
        if (!phaseResult.success && phase.successThreshold > 0) {
          const successRate = phaseResult.trailsAdded / phaseResult.trailsProcessed;
          if (successRate < phase.successThreshold) {
            console.error(`❌ Phase ${phase.name} failed with ${successRate * 100}% success rate`);
            break;
          }
        }
        
        // If this is the full import and we've reached our target, stop
        if (phase.name === 'Full Import' && totalImported >= this.config.targetTrails) {
          console.log(`🎉 Target reached! Imported ${totalImported} trails`);
          break;
        }
        
        // Brief pause between phases
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const duration = Date.now() - this.startTime;
      
      return {
        success: totalImported > 0,
        message: `Autonomous import completed: ${totalImported} trails imported in ${Math.round(duration / 1000)}s`,
        trailsImported: totalImported,
        timeElapsed: duration,
        phases
      };
      
    } catch (error) {
      console.error('💥 Autonomous import failed:', error);
      
      return {
        success: false,
        message: `Autonomous import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        trailsImported: totalImported,
        timeElapsed: Date.now() - this.startTime,
        phases
      };
    }
  }
  
  private async executePhase(phase: ImportPhase): Promise<PhaseResult> {
    const phaseStart = Date.now();
    let attempt = 0;
    
    while (attempt < this.config.maxRetries) {
      try {
        console.log(`📊 Phase ${phase.name} - Attempt ${attempt + 1}/${this.config.maxRetries}`);
        
        // Generate trail data for this phase
        const generator = new TrailDataGenerator();
        const trails = generator.generateTrails(phase.trailCount);
        
        // Process in batches
        const processor = new BatchProcessor(this.supabase);
        const result = await processor.processBatches(trails, phase.batchSize, phase.concurrency);
        
        const duration = Date.now() - phaseStart;
        
        return {
          phase: phase.name,
          success: result.totalAdded > 0,
          trailsProcessed: result.totalProcessed,
          trailsAdded: result.totalAdded,
          trailsFailed: result.totalFailed,
          duration,
          errors: result.errors
        };
        
      } catch (error) {
        attempt++;
        console.error(`❌ Phase ${phase.name} attempt ${attempt} failed:`, error);
        
        if (attempt >= this.config.maxRetries) {
          return {
            phase: phase.name,
            success: false,
            trailsProcessed: 0,
            trailsAdded: 0,
            trailsFailed: phase.trailCount,
            duration: Date.now() - phaseStart,
            errors: [error instanceof Error ? error.message : 'Unknown error']
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
      }
    }
    
    // Should never reach here, but TypeScript needs this
    throw new Error(`Phase ${phase.name} exceeded maximum retries`);
  }
}
