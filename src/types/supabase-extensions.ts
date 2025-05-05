
import { SupabaseClient, PostgrestResponse, PostgrestSingleResponse, PostgrestFilterBuilder } from '@supabase/supabase-js';
import { BulkImportJob, ImportJob } from '@/hooks/useTrailImport';

// Define a generic type for the extended filter builder
interface ExtendedPostgrestFilterBuilder<T> extends PostgrestFilterBuilder<any, any, T[]> {
  then: (onFulfilled?: ((value: PostgrestResponse<T[]>) => any)) => Promise<any>;
}

export function createExtendedSupabaseClient(supabase: SupabaseClient) {
  return {
    ...supabase,
    from: (table: string) => {
      const originalFrom = supabase.from(table);
      
      if (table === 'bulk_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args) as PostgrestFilterBuilder<any, any, BulkImportJob[]>;
            return {
              ...query,
              then: (onFulfilled?: ((value: PostgrestResponse<BulkImportJob[]>) => any)) => {
                return query.then(onFulfilled as any);
              }
            } as ExtendedPostgrestFilterBuilder<BulkImportJob>;
          }
        };
      }
      
      if (table === 'trail_import_jobs') {
        return {
          ...originalFrom,
          select: (...args: any[]) => {
            const query = originalFrom.select(...args) as PostgrestFilterBuilder<any, any, ImportJob[]>;
            return {
              ...query,
              then: (onFulfilled?: ((value: PostgrestResponse<ImportJob[]>) => any)) => {
                return query.then(onFulfilled as any);
              }
            } as ExtendedPostgrestFilterBuilder<ImportJob>;
          }
        };
      }
      
      return originalFrom;
    }
  };
}
