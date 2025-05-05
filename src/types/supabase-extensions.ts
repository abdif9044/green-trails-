
import { SupabaseClient } from '@supabase/supabase-js';
import { BulkImportJob, ImportJob } from '@/hooks/useTrailImport';

export function createExtendedSupabaseClient(supabase: SupabaseClient) {
  return {
    ...supabase,
    from: (table: string) => {
      const originalFrom = supabase.from(table);
      
      if (table === 'bulk_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args);
            
            return {
              ...query,
              then: (onFulfilled?: ((value: { data: BulkImportJob[] | null, error: any }) => any)) => {
                return query.then(onFulfilled);
              }
            };
          }
        };
      }
      
      if (table === 'trail_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args);
            
            return {
              ...query,
              then: (onFulfilled?: ((value: { data: ImportJob[] | null, error: any }) => any)) => {
                return query.then(onFulfilled);
              }
            };
          }
        };
      }
      
      return originalFrom;
    }
  };
}
