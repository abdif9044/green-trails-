
import { ImportService } from './import-service';

export class GeneralImportService {
  static async forceBootstrap(): Promise<boolean> {
    return ImportService.forceBootstrap();
  }
}
