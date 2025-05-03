
// This file now serves as a re-export to maintain backward compatibility
// with existing imports.
// For new code, prefer importing directly from the database module structure.

import { DatabaseSetupService, useDatabaseSetup } from './database/setup-service';

export { DatabaseSetupService, useDatabaseSetup };
