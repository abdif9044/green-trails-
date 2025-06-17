
import { ImportService } from './import-service';
import { ProgressService } from './progress-service';
import type { BulkImportJob } from './types';

interface MassiveImportConfig {
  sources: string[];
  maxTrailsPerSource: number;
  batchSize?: number;
  concurrency?: number;
}

export class MassiveTrailImportService {
  static async startMassiveImport(config: MassiveImportConfig): Promise<{ jobId: string; success: boolean }> {
    // Use the centralized import service
    return ImportService.quickStart50KTrails();
  }

  static async getImportProgress(jobId: string) {
    return ProgressService.getImportProgress(jobId);
  }

  static async quickStart50KTrails(): Promise<{ jobId: string; success: boolean }> {
    return ImportService.quickStart50KTrails();
  }

  static async getTrailCount(): Promise<number> {
    return ProgressService.getCurrentTrailCount();
  }
}
