
// Main export file for trail import services
export * from './types';
export { ValidationService } from './validation-service';
export { ProgressService } from './progress-service';
export { ImportService } from './import-service';

// Re-export existing services for backward compatibility
export { GeneralImportService } from './general-import-service';
export { DiagnosticsService } from './diagnostics-service';
export { BootstrapChecker } from './bootstrap-checker';
export { AutoBootstrapService } from './auto-bootstrap-service';
export { MassiveTrailImportService } from './massive-import-service';
export { DebugImportService } from './debug-import-service';
export { EnhancedDebugImportService } from './enhanced-debug-service';

// Legacy compatibility
export const useTrailImportServices = () => ({
  ValidationService,
  ProgressService,
  ImportService
});
