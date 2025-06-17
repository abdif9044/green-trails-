
import { ProgressService } from './progress-service';

export class BootstrapChecker {
  static async getCurrentTrailCount(): Promise<number> {
    return ProgressService.getCurrentTrailCount();
  }

  static async checkIfBootstrapNeeded(): Promise<{ needed: boolean; currentCount: number }> {
    return ProgressService.checkIfBootstrapNeeded();
  }

  static async getBootstrapProgress() {
    return ProgressService.getBootstrapProgress();
  }
}
