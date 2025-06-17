
import { ProgressService } from './progress-service';
import { ValidationService } from './validation-service';
import { ImportService } from './import-service';

export class AutoBootstrapService {
  static async checkAndBootstrap(): Promise<{ needed: boolean; triggered: boolean; currentCount: number }> {
    try {
      const { needed, currentCount } = await ProgressService.checkIfBootstrapNeeded();
      
      if (needed) {
        if (currentCount < 1000) {
          console.log('🎯 Auto-triggering Rochester import for 5,555 trails...');
          const rochesterTriggered = await ImportService.forceRochesterImport();
          if (rochesterTriggered) {
            return { needed, triggered: true, currentCount };
          }
        }
        
        const triggered = await ImportService.forceBootstrap();
        return { needed, triggered, currentCount };
      }
      
      return { needed: false, triggered: false, currentCount };
    } catch (error) {
      console.error('Error in checkAndBootstrap:', error);
      return { needed: true, triggered: false, currentCount: 0 };
    }
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    return ImportService.autoTriggerRochesterImport();
  }

  static async forceBootstrap(): Promise<boolean> {
    return ImportService.forceBootstrap();
  }

  static async forceRochesterImport(): Promise<boolean> {
    return ImportService.forceRochesterImport();
  }

  static async getBootstrapProgress() {
    return ProgressService.getBootstrapProgress();
  }

  static async runDiagnostics() {
    return ValidationService.validateEnvironment();
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
