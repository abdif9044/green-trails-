
// Main export file for trail import services
export * from './types';
export { ValidationService } from './validation-service';
export { ImportService } from './import-service';

// Create a simple ProgressService since it's missing
export class ProgressService {
  static async getImportProgress(jobId: string): Promise<any> {
    // Mock implementation for now
    return { progress: 0, status: 'unknown' };
  }

  static async getCurrentTrailCount(): Promise<number> {
    // Mock implementation for now
    return 0;
  }
}

// Re-export existing services for backward compatibility
export { GeneralImportService } from './general-import-service';
export { DiagnosticsService } from './diagnostics-service';
export { BootstrapChecker } from './bootstrap-checker';
export { AutoBootstrapService } from './auto-bootstrap-service';
export { MassiveTrailImportService } from './massive-import-service';
export { DebugImportService } from './debug-import-service';
export { EnhancedDebugImportService } from './enhanced-debug-service';

// Legacy compatibility function - import the services properly
import { ValidationService } from './validation-service';
import { ImportService } from './import-service';

export const useTrailImportServices = () => ({
  ValidationService,
  ProgressService,
  ImportService
});
