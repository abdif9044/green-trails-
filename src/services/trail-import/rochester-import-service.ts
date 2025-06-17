
import { ImportService } from './import-service';

export class RochesterImportService {
  static async forceRochesterImport(): Promise<boolean> {
    return ImportService.forceRochesterImport();
  }

  static async autoTriggerRochesterImport(): Promise<boolean> {
    return ImportService.autoTriggerRochesterImport();
  }
}
