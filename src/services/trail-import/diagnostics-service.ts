
import { ValidationService } from './validation-service';

export class DiagnosticsService {
  static async runDiagnostics() {
    return ValidationService.validateEnvironment();
  }
}
