
import { BootstrapChecker } from './bootstrap-checker';
import { DiagnosticsService } from './diagnostics-service';
import { RochesterImportService } from './rochester-import-service';
import { GeneralImportService } from './general-import-service';

export class AutoBootstrapService {
  static async checkAndBootstrap(): Promise<{ needed: boolean; triggered: boolean; currentCount: number }> {
    try {
      const { needed, currentCount } = await BootstrapChecker.checkIfBootstrapNeeded();
      
      if (needed) {
        // Auto-trigger Rochester import if count is very low
        if (currentCount < 1000) {
          console.log('🎯 Auto-triggering Rochester import for 5,555 trails...');
          const rochesterTriggered = await RochesterImportService.forceRochesterImport();
          if (rochesterTriggered) {
            return { needed, triggered: true, currentCount };
          }
        }
        
        const triggered = await GeneralImportService.forceBootstrap();
        return { needed, triggered, currentCount };
      }
      
      return { needed: false, triggered: false, currentCount };
    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: true, triggered: false, currentCount: 0 };
    }
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    return RochesterImportService.autoTriggerRochesterImport();
  }

  static async forceBootstrap(): Promise<boolean> {
    return GeneralImportService.forceBootstrap();
  }

  static async forceRochesterImport(): Promise<boolean> {
    return RochesterImportService.forceRochesterImport();
  }

  static async getBootstrapProgress() {
    return BootstrapChecker.getBootstrapProgress();
  }

  static async runDiagnostics() {
    return DiagnosticsService.runDiagnostics();
  }

  private static async getCurrentTrailCount(): Promise<number> {
    return BootstrapChecker.getCurrentTrailCount();
  }
}

// Auto-execute Rochester import immediately
(async () => {
  try {
    console.log('🎯 GreenTrails: Auto-executing Rochester trail import...');
    const success = await AutoBootstrapService.autoTriggerRochesterImport();
    
    if (success) {
      console.log('🚀 Rochester import started successfully! 5,555 trails incoming...');
    } else {
      console.log('⚠️ Rochester import could not be started automatically');
    }
  } catch (error) {
    console.error('❌ Auto-execution error:', error);
  }
})();

export const autoBootstrapService = AutoBootstrapService;
